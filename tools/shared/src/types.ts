export type Difficulty = 'introduction' | 'facile' | 'moyen' | 'difficile' | 'expert';
export type QuestionType = 'python' | 'sql' | 'qcm' | 'ouvert';

export interface BankQuestion {
  id: string;
  label: string;
  content: string;
  difficulty?: Difficulty | string;
  type?: QuestionType | string;
  notion?: string;
  niveau?: string;
  correction?: string;
  verificationCode?: string;
  bareme?: number;
  choices?: string[];
  answer?: number;
}

export interface QcmQuestion {
  id: string;
  question: string;
  choices: string[];
  answer: number;
  notion?: string;
  niveau?: string;
  explanation?: string;
}

export interface Student {
  id: string;
  name: string;
  average?: number;
  appreciation?: string;
  [key: string]: unknown;
}

export interface ReferentielCourse {
  slug: string;
  title: string;
  chapter: string;
  level: string;
  description?: string;
}

export interface ReferentielLevel {
  id: string;
  label: string;
  chapters: string[];
  courses: ReferentielCourse[];
}

export interface ReferentielNsi {
  levels: ReferentielLevel[];
  generatedAt: string;
}
