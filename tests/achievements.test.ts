import { describe, expect, it } from 'vitest';
import {
  completedChapterNames,
  globalAchievementsUnlockedBetween,
  type AchievementStats,
} from '../lib/achievements';

function stats(partial: Partial<AchievementStats> & Pick<AchievementStats, 'badgesCount' | 'exercisesCount'>): AchievementStats {
  return {
    badges: [],
    completedChapters: [],
    ...partial,
  };
}

describe('succès', () => {
  it('marque un chapitre terminé seulement quand chaque fiche a son badge', () => {
    const sheets = [
      { courseId: 'les-boucles-python', chapter: 'Introduction à Python' },
      { courseId: 'types-python', chapter: 'Introduction à Python' },
      { courseId: 'terminale_poo', chapter: 'POO' },
    ];
    expect(completedChapterNames(sheets, ['les-boucles-python'])).toEqual([]);
    expect(completedChapterNames(sheets, ['les-boucles-python', 'types-python'])).toEqual(['Introduction à Python']);
  });

  it('annonce le palier d’exercices au franchissement, pas avant', () => {
    const before = stats({ badgesCount: 0, exercisesCount: 4 });
    const after = stats({ badgesCount: 0, exercisesCount: 5 });
    expect(globalAchievementsUnlockedBetween(before, after).map((item) => item.id)).toEqual(['exercise_warrior_1']);
    expect(globalAchievementsUnlockedBetween(after, stats({ badgesCount: 0, exercisesCount: 6 }))).toEqual([]);
  });
});
