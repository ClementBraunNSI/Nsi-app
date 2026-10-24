import { createRequire } from 'node:module';
import * as Blockly from 'blockly/core';
import { describe, expect, it } from 'vitest';
import { defineEnqueteBlocks, setBlocklySchema, workspaceToSql } from '../lib/enquetes/blockly';
import { buildSqlScript } from '../lib/enquetes/build';
import { getEnquete } from '../lib/enquetes/cases';
import type { Enquete } from '../lib/enquetes/types';

const require = createRequire(import.meta.url);

type Db = { exec: (sql: string) => { columns: string[]; values: unknown[][] }[]; close: () => void };
type Clause = { type: string; fields?: Record<string, unknown>; inputs?: Record<string, { block: unknown }> };

/** Enchaîne des blocs les uns sous les autres, au format de sérialisation de Blockly. */
function stack(clauses: Clause[]): unknown {
  const [first, ...rest] = clauses;
  if (!first) return undefined;
  const next = stack(rest);
  return { ...first, ...(next ? { next: { block: next } } : {}) };
}

function sqlFromBlocks(enquete: Enquete, table: string, clauses: Clause[]) {
  defineEnqueteBlocks();
  setBlocklySchema(enquete);
  const workspace = new Blockly.Workspace();
  Blockly.serialization.workspaces.load(
    {
      blocks: {
        languageVersion: 0,
        blocks: [{ type: 'enquete_requete', x: 0, y: 0, fields: { TABLE: table }, inputs: { CLAUSES: { block: stack(clauses) } } }],
      },
    },
    workspace,
  );
  const sql = workspaceToSql(workspace);
  workspace.dispose();
  return sql;
}

async function run(enquete: Enquete, sql: string | null) {
  const initSqlJs = require('sql.js/dist/sql-asm.js') as () => Promise<{ Database: new () => Db }>;
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  db.exec(buildSqlScript(enquete));
  const [result] = db.exec(sql ?? '');
  db.close();
  return result;
}

const filtre = (COL: string, OP: string, VALUE: string | number): Clause => ({ type: 'enquete_filtre', fields: { COL, OP, VALUE: String(VALUE) } });
const relier = (TABLE: string, LEFT: string, RIGHT: string): Clause => ({ type: 'enquete_relier', fields: { TABLE, LEFT, RIGHT } });
const colonne = (COL: string): Clause => ({ type: 'enquete_colonne', fields: { COL } });

describe('enquêtes en mode Blocs', () => {
  it('« Qui a croqué les œufs ? » se résout avec des filtres', async () => {
    const enquete = getEnquete('oeufs-croques')!;
    const sql = sqlFromBlocks(enquete, 'animaux', [
      filtre('animaux.pelage', '=', 'brun et blanc'),
      filtre('animaux.terrier', '=', 'Vieux Moulin'),
      filtre('animaux.taille_cm', '>=', 15),
      filtre('animaux.taille_cm', '<=', 35),
      colonne('animaux.nom'),
    ]);
    expect(sql).toContain("WHERE animaux.pelage = 'brun et blanc'");
    const result = await run(enquete, sql);
    expect(result.values).toEqual([['Zélie']]);
  });

  it('« Le miel envolé » : les alibis du jour désignent le seul blaireau sans alibi pendant le vol', async () => {
    const enquete = getEnquete('miel-envole')!;
    const sql = sqlFromBlocks(enquete, 'animaux', [
      relier('alibis', 'animaux.id', 'alibis.animal_id'),
      filtre('animaux.espece', '=', 'blaireau'),
      filtre('alibis.date', '=', '2026-10-19'),
      colonne('animaux.nom'),
      colonne('alibis.debut'),
      colonne('alibis.fin'),
    ]);
    const result = await run(enquete, sql);
    const sansAlibi = result.values.filter(([, debut, fin]) => !(String(debut) <= '14:00' && String(fin) >= '16:00')).map(([nom]) => nom);
    expect(sansAlibi).toEqual([enquete.culprit]);
  });

  it('« Le barrage percé » : corde + club, puis comptage des passages', async () => {
    const enquete = getEnquete('barrage-perce')!;
    const corde = await run(
      enquete,
      sqlFromBlocks(enquete, 'achats', [
        relier('animaux', 'achats.animal_id', 'animaux.id'),
        relier('clubs', 'clubs.animal_id', 'animaux.id'),
        filtre('achats.article', '=', 'corde'),
        filtre('achats.date', '=', '2026-10-25'),
        filtre('clubs.club', 'CONTAINS', 'Nageurs'),
        colonne('animaux.nom'),
      ]),
    );
    const sql = sqlFromBlocks(enquete, 'passages', [
      relier('animaux', 'passages.animal_id', 'animaux.id'),
      filtre('passages.lieu', '=', 'Barrage des Castors'),
      { type: 'enquete_compter', fields: { COL: 'animaux.nom' } },
      { type: 'enquete_au_moins', fields: { N: 3 } },
      { type: 'enquete_trier', fields: { COL: 'nombre', DIR: 'DESC' } },
    ]);
    expect(sql).toContain('GROUP BY animaux.nom');
    expect(sql).toContain('HAVING COUNT(*) >= 3');
    const habitues = await run(enquete, sql);
    const suspects = corde.values.map(([nom]) => nom).filter((nom) => habitues.values.some(([autre]) => autre === nom));
    expect(suspects).toEqual([enquete.culprit]);
  });

  it('ignore une recherche sans bloc de départ et protège les apostrophes', () => {
    const enquete = getEnquete('oeufs-croques')!;
    defineEnqueteBlocks();
    setBlocklySchema(enquete);
    const vide = new Blockly.Workspace();
    expect(workspaceToSql(vide)).toBeNull();
    vide.dispose();
    expect(sqlFromBlocks(enquete, 'temoignages', [filtre('temoignages.texte', 'CONTAINS', "l'arbre")])).toContain("LIKE '%l''arbre%'");
  });
});
