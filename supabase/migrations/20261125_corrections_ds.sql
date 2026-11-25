-- Corrections de DS : le sujet et la correction d'un devoir surveillé, en Markdown, déposés par l'enseignant
-- depuis le panel admin. Rien de ces textes ne passe par le dépôt (public) : ils ne vivent qu'en base.
-- Élèves : lecture seule, et seulement à partir de la date choisie, pour les classes visées. Avant cette date,
-- la ligne entière (titre, sujet, correction) reste invisible : le filtre est fait par RLS, pas par l'interface.
-- Admin et enseignant : accès complet.

create table if not exists public.ds_corrections (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  -- Classes concernées, comme profiles.classe (ex. 1NSI1).
  classes text[] not null check (cardinality(classes) between 1 and 40),
  -- Textes Markdown fournis par l'enseignant (import d'un fichier .md ou collage).
  subject_md text not null default '' check (char_length(subject_md) <= 200000),
  correction_md text not null default '' check (char_length(correction_md) <= 200000),
  -- Date et heure de mise à disposition pour les élèves.
  visible_at timestamptz not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ds_corrections_classes_idx on public.ds_corrections using gin (classes);
create index if not exists ds_corrections_visible_idx on public.ds_corrections (visible_at);
create index if not exists ds_corrections_created_by_idx on public.ds_corrections (created_by);

alter table public.ds_corrections enable row level security;
revoke all on public.ds_corrections from anon;

-- Classe de l'élève connecté (null pour un autre rôle ou sans classe).
create or replace function private.student_classe()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select nullif(trim(p.classe), '')
  from public.profiles p
  where p.id = (select auth.uid()) and p.role = 'student';
$$;

revoke all on function private.student_classe() from public, anon;
grant execute on function private.student_classe() to authenticated;

drop policy if exists ds_corrections_elevated on public.ds_corrections;
create policy ds_corrections_elevated on public.ds_corrections for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

drop policy if exists ds_corrections_student_read on public.ds_corrections;
create policy ds_corrections_student_read on public.ds_corrections for select to authenticated
  using (visible_at <= now() and (select private.student_classe()) = any (classes));
