-- Travail rendu par les élèves et avancée des enquêtes.
-- Lecture : l'élève voit ses lignes, un compte admin ou enseignant voit tout.
-- Écriture : seulement par le serveur (clé de service), après vérification.

create table if not exists public.exercise_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id text not null,
  course_id text not null,
  -- code : programme passé au bouton Vérifier ; reponse : réponse écrite à un exercice sans éditeur.
  kind text not null check (kind in ('code', 'reponse')),
  content text not null check (char_length(content) <= 60000),
  -- Résultat des tests pour du code ; null pour une réponse écrite.
  passed boolean,
  -- auto : validé par les tests ; en_attente : à corriger ; validee / a_revoir : décision de l'enseignant.
  status text not null default 'en_attente' check (status in ('auto', 'en_attente', 'validee', 'a_revoir')),
  feedback text check (feedback is null or char_length(feedback) <= 2000),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null
);

create index if not exists exercise_submissions_user_idx
  on public.exercise_submissions (user_id, exercise_id, created_at desc);
create index if not exists exercise_submissions_pending_idx
  on public.exercise_submissions (status, created_at desc) where status = 'en_attente';

alter table public.exercise_submissions enable row level security;

drop policy if exists exercise_submissions_select_own_or_elevated on public.exercise_submissions;
create policy exercise_submissions_select_own_or_elevated on public.exercise_submissions
  for select to authenticated
  using ((select auth.uid()) = user_id or (select private.is_elevated()));

create table if not exists public.enquete_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  -- Rang de l'étape élucidée : 0 pour la première.
  stage integer not null check (stage >= 0),
  hints_used integer not null default 0 check (hints_used >= 0),
  attempts integer not null default 0 check (attempts >= 0),
  solved_at timestamptz not null default now(),
  primary key (user_id, slug, stage)
);

alter table public.enquete_progress enable row level security;

drop policy if exists enquete_progress_select_own_or_elevated on public.enquete_progress;
create policy enquete_progress_select_own_or_elevated on public.enquete_progress
  for select to authenticated
  using ((select auth.uid()) = user_id or (select private.is_elevated()));
