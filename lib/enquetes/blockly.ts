"use client";

import * as Blockly from "blockly/core";
import type { PublicEnquete as Enquete } from "./types";

/**
 * Blocs Blockly des enquêtes. Ils construisent une requête SQL lisible, montrée à l'élève
 * à côté des blocs : c'est le pont vers le mode SQL.
 *
 * Les menus (tables, colonnes) dépendent de l'enquête ouverte : setBlocklySchema() les renseigne
 * avant de créer l'espace de travail.
 */

let tables: string[] = [];
let columns: string[] = [];

export function setBlocklySchema(enquete: Enquete) {
  tables = enquete.tables.map((table) => table.name);
  columns = enquete.tables.flatMap((table) => table.columns.map((column) => `${table.name}.${column.name}`));
}

const tableOptions = (): [string, string][] => (tables.length ? tables : ["?"]).map((name) => [name, name]);
const columnOptions = (): [string, string][] => (columns.length ? columns : ["?"]).map((name) => [name, name]);
const sortOptions = (): [string, string][] => [["nombre (le comptage)", "nombre"], ...columnOptions()];

const OPERATORS: [string, string][] = [
  ["=", "="],
  ["≠", "!="],
  ["<", "<"],
  [">", ">"],
  ["≤", "<="],
  ["≥", ">="],
  ["contient", "CONTAINS"],
  ["commence par", "STARTS"],
];

const HUE = { query: 25, filter: 200, link: 160, show: 280, count: 340 } as const;

let defined = false;

export function defineEnqueteBlocks() {
  if (defined) return;
  defined = true;

  Blockly.Blocks["enquete_requete"] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField("Chercher dans la table").appendField(new Blockly.FieldDropdown(tableOptions), "TABLE");
      this.appendStatementInput("CLAUSES").setCheck("clause").appendField("puis");
      this.setColour(HUE.query);
      this.setTooltip("Le point de départ : la table où chercher. Accroche dessous les filtres et les options.");
      this.setDeletable(true);
    },
  };

  Blockly.Blocks["enquete_filtre"] = {
    init(this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("garder si")
        .appendField(new Blockly.FieldDropdown(columnOptions), "COL")
        .appendField(new Blockly.FieldDropdown(OPERATORS), "OP")
        .appendField(new Blockly.FieldTextInput("valeur"), "VALUE");
      this.setPreviousStatement(true, "clause");
      this.setNextStatement(true, "clause");
      this.setColour(HUE.filter);
      this.setTooltip("Ne garde que les lignes qui respectent la condition. Plusieurs filtres se cumulent (ET).");
    },
  };

  Blockly.Blocks["enquete_condition"] = {
    init(this: Blockly.Block) {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(columnOptions), "COL")
        .appendField(new Blockly.FieldDropdown(OPERATORS), "OP")
        .appendField(new Blockly.FieldTextInput("valeur"), "VALUE");
      this.setPreviousStatement(true, "condition");
      this.setNextStatement(true, "condition");
      this.setColour(HUE.filter);
      this.setTooltip("Une condition à placer dans le bloc « garder si l'une de ces conditions ».");
    },
  };

  Blockly.Blocks["enquete_ou"] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField("garder si l'une de ces conditions est vraie");
      this.appendStatementInput("CONDS").setCheck("condition");
      this.setPreviousStatement(true, "clause");
      this.setNextStatement(true, "clause");
      this.setColour(HUE.filter);
      this.setTooltip("OU : la ligne est gardée si au moins une des conditions est vraie.");
    },
  };

  Blockly.Blocks["enquete_relier"] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField("relier la table").appendField(new Blockly.FieldDropdown(tableOptions), "TABLE");
      this.appendDummyInput()
        .appendField("quand")
        .appendField(new Blockly.FieldDropdown(columnOptions), "LEFT")
        .appendField("=")
        .appendField(new Blockly.FieldDropdown(columnOptions), "RIGHT");
      this.setPreviousStatement(true, "clause");
      this.setNextStatement(true, "clause");
      this.setColour(HUE.link);
      this.setTooltip("Associe chaque ligne à celle d'une autre table qui partage la même valeur (une jointure).");
    },
  };

  Blockly.Blocks["enquete_colonne"] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField("afficher la colonne").appendField(new Blockly.FieldDropdown(columnOptions), "COL");
      this.setPreviousStatement(true, "clause");
      this.setNextStatement(true, "clause");
      this.setColour(HUE.show);
      this.setTooltip("Sans ce bloc, toutes les colonnes sont affichées.");
    },
  };

  Blockly.Blocks["enquete_trier"] = {
    init(this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("trier par")
        .appendField(new Blockly.FieldDropdown(sortOptions), "COL")
        .appendField(new Blockly.FieldDropdown([["croissant", "ASC"], ["décroissant", "DESC"]]), "DIR");
      this.setPreviousStatement(true, "clause");
      this.setNextStatement(true, "clause");
      this.setColour(HUE.show);
    },
  };

  Blockly.Blocks["enquete_limiter"] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField("garder les").appendField(new Blockly.FieldNumber(5, 1, 500, 1), "N").appendField("premières lignes");
      this.setPreviousStatement(true, "clause");
      this.setNextStatement(true, "clause");
      this.setColour(HUE.show);
    },
  };

  Blockly.Blocks["enquete_compter"] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField("compter les lignes pour chaque").appendField(new Blockly.FieldDropdown(columnOptions), "COL");
      this.setPreviousStatement(true, "clause");
      this.setNextStatement(true, "clause");
      this.setColour(HUE.count);
      this.setTooltip("Regroupe les lignes qui ont la même valeur et les compte (colonne « nombre »).");
    },
  };

  Blockly.Blocks["enquete_au_moins"] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField("garder les groupes d'au moins").appendField(new Blockly.FieldNumber(2, 1, 500, 1), "N").appendField("lignes");
      this.setPreviousStatement(true, "clause");
      this.setNextStatement(true, "clause");
      this.setColour(HUE.count);
      this.setTooltip("À utiliser après « compter les lignes pour chaque ».");
    },
  };
}

export const TOOLBOX = {
  kind: "categoryToolbox",
  contents: [
    { kind: "category", name: "Chercher", colour: String(HUE.query), contents: [{ kind: "block", type: "enquete_requete" }] },
    {
      kind: "category",
      name: "Filtrer",
      colour: String(HUE.filter),
      contents: [
        { kind: "block", type: "enquete_filtre" },
        { kind: "block", type: "enquete_ou" },
        { kind: "block", type: "enquete_condition" },
      ],
    },
    { kind: "category", name: "Relier", colour: String(HUE.link), contents: [{ kind: "block", type: "enquete_relier" }] },
    {
      kind: "category",
      name: "Afficher",
      colour: String(HUE.show),
      contents: [
        { kind: "block", type: "enquete_colonne" },
        { kind: "block", type: "enquete_trier" },
        { kind: "block", type: "enquete_limiter" },
      ],
    },
    {
      kind: "category",
      name: "Compter",
      colour: String(HUE.count),
      contents: [
        { kind: "block", type: "enquete_compter" },
        { kind: "block", type: "enquete_au_moins" },
      ],
    },
  ],
};

/** Espace de départ : une recherche dans la table des rapports. */
export function starterState(): object {
  return {
    blocks: {
      languageVersion: 0,
      blocks: [{ type: "enquete_requete", x: 30, y: 30, fields: { TABLE: "rapports" } }],
    },
  };
}

// ---------- Traduction en SQL ----------

function literal(raw: string) {
  const value = raw.trim();
  if (/^-?\d+(\.\d+)?$/.test(value)) return value;
  return `'${value.replace(/'/g, "''")}'`;
}

function condition(block: Blockly.Block) {
  const col = block.getFieldValue("COL");
  const op = block.getFieldValue("OP");
  const value = String(block.getFieldValue("VALUE") ?? "");
  if (op === "CONTAINS") return `${col} LIKE ${literal(`%${value.trim()}%`)}`;
  if (op === "STARTS") return `${col} LIKE ${literal(`${value.trim()}%`)}`;
  return `${col} ${op} ${literal(value)}`;
}

function chain(first: Blockly.Block | null) {
  const out: Blockly.Block[] = [];
  for (let block = first; block; block = block.getNextBlock()) {
    if (!block.isEnabled()) continue;
    out.push(block);
  }
  return out;
}

/** Requête SQL construite par le bloc « Chercher dans la table », ou null s'il n'y en a pas. */
export function workspaceToSql(workspace: Blockly.Workspace): string | null {
  const top = workspace
    .getTopBlocks(true)
    .find((block) => block.type === "enquete_requete" && block.isEnabled());
  if (!top) return null;

  const table = top.getFieldValue("TABLE");
  const select: string[] = [];
  const joins: string[] = [];
  const where: string[] = [];
  let groupBy: string | null = null;
  let having: string | null = null;
  const orderBy: string[] = [];
  let limit: number | null = null;

  for (const block of chain(top.getInputTargetBlock("CLAUSES"))) {
    switch (block.type) {
      case "enquete_filtre":
        where.push(condition(block));
        break;
      case "enquete_ou": {
        const parts = chain(block.getInputTargetBlock("CONDS")).map(condition);
        if (parts.length) where.push(parts.length === 1 ? parts[0] : `(${parts.join(" OR ")})`);
        break;
      }
      case "enquete_relier":
        joins.push(`JOIN ${block.getFieldValue("TABLE")} ON ${block.getFieldValue("LEFT")} = ${block.getFieldValue("RIGHT")}`);
        break;
      case "enquete_colonne":
        select.push(block.getFieldValue("COL"));
        break;
      case "enquete_compter":
        groupBy = block.getFieldValue("COL");
        break;
      case "enquete_au_moins":
        having = `COUNT(*) >= ${Number(block.getFieldValue("N")) || 1}`;
        break;
      case "enquete_trier":
        orderBy.push(`${block.getFieldValue("COL")} ${block.getFieldValue("DIR")}`);
        break;
      case "enquete_limiter":
        limit = Number(block.getFieldValue("N")) || null;
        break;
    }
  }

  const columnsSql = groupBy
    ? [...new Set([groupBy, ...select])].join(", ") + ", COUNT(*) AS nombre"
    : select.length
      ? select.join(", ")
      : "*";

  const lines = [`SELECT ${columnsSql}`, `FROM ${table}`, ...joins];
  if (where.length) lines.push(`WHERE ${where.join("\n  AND ")}`);
  if (groupBy) lines.push(`GROUP BY ${groupBy}`);
  if (groupBy && having) lines.push(`HAVING ${having}`);
  if (orderBy.length) lines.push(`ORDER BY ${orderBy.join(", ")}`);
  if (limit) lines.push(`LIMIT ${limit}`);
  return `${lines.join("\n")};`;
}
