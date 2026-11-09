-- Note presque automatique des évaluations : la note se calcule à partir des tests (lib/evaluation-grade.ts).
-- L'enseignant vérifie les exercices signalés (fonction sans aucun test réussi, programme qui ne s'exécute pas) :
-- il garde la note automatique ou donne des points à la main. Écriture réservée à l'enseignant (politique existante).

alter table public.evaluation_answers
  add column if not exists manual_points numeric(5, 2) check (manual_points is null or manual_points between 0 and 100),
  add column if not exists reviewed_at timestamptz;
