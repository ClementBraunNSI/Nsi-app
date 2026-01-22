import { Trophy, Star, Target, Zap, Crown, Medal, Flame, BookOpen, Shield, GraduationCap, Code } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  condition: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  badgesCount: number;
  exercisesCount: number;
  badges: any[];
  level?: string;
  completedChapters: string[];
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_badge',
    title: 'Premier Triomphe',
    description: 'Obtenir votre tout premier badge.',
    icon: Star,
    color: 'text-yellow-500 bg-yellow-100',
    condition: (stats) => stats.badgesCount >= 1
  },
  {
    id: 'chapter_intro_python',
    title: 'Premiers pas en Python',
    description: 'Terminer tous les exercices du chapitre Introduction à Python.',
    icon: BookOpen,
    color: 'text-cyan-500 bg-cyan-100',
    condition: (stats) => stats.completedChapters.includes('Introduction à Python')
  },
  {
    id: 'chapter_bts_cyber',
    title: 'Expert CyberSécurité',
    description: 'Terminer tous les exercices du chapitre BTS SIO 1 : B3 - CyberSécurité.',
    icon: Shield,
    color: 'text-slate-500 bg-slate-100',
    condition: (stats) => stats.completedChapters.includes('BTS SIO 1 : B3 - CyberSécurité')
  },
  {
    id: 'chapter_bts_dev',
    title: 'Développeur C#',
    description: 'Terminer tous les exercices du chapitre BTS SIO 1 : B2 - Développement (SLAM).',
    icon: Code,
    color: 'text-violet-500 bg-violet-100',
    condition: (stats) => stats.completedChapters.includes('BTS SIO 1 : B2 - Développement (SLAM)')
  },
  {
    id: 'bts_start',
    title: 'Étudiant SIO',
    description: 'Obtenir un premier badge de niveau BTS.',
    icon: GraduationCap,
    color: 'text-pink-500 bg-pink-100',
    condition: (stats) => stats.badges.some(b => b.course_id && b.course_id.startsWith('bts_'))
  },
  {
    id: 'badge_collector_1',
    title: 'Collectionneur Amateur',
    description: 'Obtenir 3 badges différents.',
    icon: Medal,
    color: 'text-orange-500 bg-orange-100',
    condition: (stats) => stats.badgesCount >= 3
  },
  {
    id: 'badge_collector_2',
    title: 'Collectionneur Averti',
    description: 'Obtenir 5 badges différents.',
    icon: Trophy,
    color: 'text-emerald-500 bg-emerald-100',
    condition: (stats) => stats.badgesCount >= 5
  },
  {
    id: 'badge_collector_3',
    title: 'Légende des Badges',
    description: 'Obtenir 10 badges différents.',
    icon: Crown,
    color: 'text-purple-500 bg-purple-100',
    condition: (stats) => stats.badgesCount >= 10
  },
  {
    id: 'exercise_warrior_1',
    title: 'Échauffement',
    description: 'Terminer 5 exercices.',
    icon: Zap,
    color: 'text-blue-500 bg-blue-100',
    condition: (stats) => stats.exercisesCount >= 5
  },
  {
    id: 'exercise_warrior_2',
    title: 'Athlète du Code',
    description: 'Terminer 20 exercices.',
    icon: Flame,
    color: 'text-red-500 bg-red-100',
    condition: (stats) => stats.exercisesCount >= 20
  },
  {
    id: 'exercise_warrior_3',
    title: 'Grand Maître',
    description: 'Terminer 50 exercices.',
    icon: Target,
    color: 'text-indigo-500 bg-indigo-100',
    condition: (stats) => stats.exercisesCount >= 50
  }
];
