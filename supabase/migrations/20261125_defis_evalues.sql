-- Défis du lundi évalués : un défi surveillé peut être noté comme une évaluation.
-- « Noter ce défi » crée une évaluation fermée liée au défi (un seul lien par défi), avec les copies des élèves ;
-- la correction, la validation des notes, l'export CSV et les moyennes sont ceux des évaluations.
alter table public.evaluations
  add column if not exists challenge_id uuid references public.challenges(id) on delete set null;

create unique index if not exists evaluations_challenge_id_key on public.evaluations (challenge_id) where challenge_id is not null;
