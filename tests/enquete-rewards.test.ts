import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { earnedAchievementIds, ENQUETE_ACHIEVEMENTS, enqueteBadgeId } from '../lib/enquetes/rewards';
import { ENQUETES } from '../lib/enquetes/cases';
import { sheetBadgeSrc } from '../lib/sheet-badge-art';
import { acceptsWrittenAnswer } from '../lib/exercise-type';
import { ACHIEVEMENTS, achievementImage } from '../lib/achievements';
import { chapterImageFromData } from '../lib/chapter-utils';

const ALL = ['a', 'b', 'c'];

describe('enquête rewards', () => {
  it('gives the twist achievement before the last stage and the first-case one at the end', () => {
    const twist = earnedAchievementIds({ stage: 0, total: 4, hintsUsed: 2, attempts: 0, solvedSlugs: [], allSlugs: ALL });
    expect(twist).toEqual(['enquete_rebondissement']);
    const end = earnedAchievementIds({ stage: 3, total: 4, hintsUsed: 1, attempts: 0, solvedSlugs: ['a'], allSlugs: ALL });
    expect(end).toEqual(['enquete_premier_dossier']);
  });

  it('rewards a stage solved without hints, stubbornness, and every case solved', () => {
    const ids = earnedAchievementIds({ stage: 0, total: 1, hintsUsed: 0, attempts: 3, solvedSlugs: ALL, allSlugs: ALL });
    expect(ids).toEqual(['enquete_premier_dossier', 'enquete_flair', 'enquete_obstine', 'enquete_toutes']);
  });

  it('has an image for every enquête badge and achievement', () => {
    for (const enquete of ENQUETES) {
      const src = sheetBadgeSrc(enqueteBadgeId(enquete.slug));
      expect(src).toBe(`/images/badges/enquete-${enquete.slug}.png`);
      expect(fs.existsSync(path.join(process.cwd(), 'public', src!))).toBe(true);
    }
    for (const achievement of ENQUETE_ACHIEVEMENTS) {
      expect(fs.existsSync(path.join(process.cwd(), 'public', achievement.image))).toBe(true);
    }
  });
});

describe('badge and achievement illustrations', () => {
  const exists = (src: string) => fs.existsSync(path.join(process.cwd(), 'public', src));

  it('has a fox illustration for every exercise sheet', () => {
    const ids = new Set<string>();
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.mdx?$/.test(entry.name)) {
          for (const match of fs.readFileSync(full, 'utf8').matchAll(/courseId="([^"]+)"/g)) ids.add(match[1]);
        }
      }
    };
    walk(path.join(process.cwd(), 'content'));
    const missing = [...ids].filter((id) => {
      const src = sheetBadgeSrc(id);
      return !src || !exists(src);
    });
    expect(missing).toEqual([]);
  });

  it('has a level-fox illustration for every chapter', () => {
    const missing: string[] = [];
    for (const folder of fs.readdirSync(path.join(process.cwd(), 'content'))) {
      const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) walk(full);
          else if (/\.mdx?$/.test(entry.name)) {
            const match = fs.readFileSync(full, 'utf8').match(/^chapter:\s*(.+)$/m);
            if (!match) continue;
            const name = match[1].trim().replace(/^["']|["']$/g, '');
            const src = chapterImageFromData(folder, name);
            if (!src?.startsWith('/images/chapitres/') || !exists(src)) missing.push(`${folder} : ${name}`);
          }
        }
      };
      walk(path.join(process.cwd(), 'content', folder));
    }
    expect([...new Set(missing)]).toEqual([]);
  });

  it('has an illustration for every site achievement', () => {
    for (const achievement of ACHIEVEMENTS) {
      const src = achievementImage(achievement.id);
      expect(src && exists(src)).toBe(true);
    }
  });
});

describe('written answers', () => {
  it('opens an answer box on reading and other exercises, not on instructions or lessons', () => {
    expect(acceptsWrittenAnswer('lecture', '2 [Facile] - Comparaisons simples')).toBe(true);
    expect(acceptsWrittenAnswer('autre', '1. Découverte')).toBe(true);
    expect(acceptsWrittenAnswer('lecture', 'Important - Consignes importantes')).toBe(false);
    expect(acceptsWrittenAnswer('lecture', '1.0 [Introduction] - Variables : le cours')).toBe(false);
    expect(acceptsWrittenAnswer('python', 'Somme')).toBe(false);
  });
});
