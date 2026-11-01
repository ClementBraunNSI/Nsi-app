-- Défi du lundi : un exercice inédit écrit par l'enseignant, ouvert chaque lundi aux classes choisies.
-- Énoncé, tests et correction restent en base (le dépôt est public) : l'élève ne reçoit l'énoncé qu'à l'ouverture,
-- la correction qu'après la fermeture, et jamais les tests. La vérification lit les tests côté serveur (clé de service).

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  classes text[] not null default '{}',
  -- Texte écrit par l'enseignant, au format des fiches (un bloc <ExerciseSection>).
  source text not null check (char_length(source) <= 100000),
  -- Partie envoyée à l'élève : { id, label, type, statement, starter, sqlSetup, packages }.
  exercise jsonb not null,
  -- Réservé à l'enseignant et au serveur : { verification, correction }.
  grading jsonb not null,
  opens_at timestamptz not null,
  closes_at timestamptz not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  check (closes_at > opens_at)
);

create index if not exists challenges_opens_idx on public.challenges (opens_at desc);
create index if not exists challenges_created_by_idx on public.challenges (created_by);

create table if not exists public.challenge_submissions (
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  code text not null default '' check (char_length(code) <= 60000),
  attempts integer not null default 0,
  passed boolean not null default false,
  tests_passed integer,
  tests_total integer,
  first_passed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (challenge_id, user_id)
);

create index if not exists challenge_submissions_user_idx on public.challenge_submissions (user_id);

alter table public.challenges enable row level security;
alter table public.challenge_submissions enable row level security;

drop policy if exists challenges_elevated on public.challenges;
create policy challenges_elevated on public.challenges for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

drop policy if exists challenge_submissions_elevated on public.challenge_submissions;
create policy challenge_submissions_elevated on public.challenge_submissions for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

-- Défis de l'élève (ouverts pour sa classe), sans les tests ; correction seulement après la fermeture.
-- Pour chacun : son résultat et combien d'élèves de sa classe l'ont réussi.
create or replace function public.challenge_list_mine()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_classe text;
  v_size integer;
begin
  if v_uid is null then
    return '[]'::jsonb;
  end if;
  select p.classe into v_classe from public.profiles p where p.id = v_uid;
  if v_classe is null then
    return '[]'::jsonb;
  end if;
  select count(*)::integer into v_size from public.profiles p where p.classe = v_classe and p.role = 'student';

  return coalesce((
    select jsonb_agg(item order by item ->> 'opensAt' desc)
    from (
      select jsonb_build_object(
        'id', c.id,
        'title', c.title,
        'opensAt', c.opens_at,
        'closesAt', c.closes_at,
        'open', now() < c.closes_at,
        'exercise', c.exercise,
        'correction', case when now() >= c.closes_at then c.grading ->> 'correction' end,
        'mine', (
          select jsonb_build_object('code', s.code, 'attempts', s.attempts, 'passed', s.passed, 'firstPassedAt', s.first_passed_at)
          from public.challenge_submissions s where s.challenge_id = c.id and s.user_id = v_uid
        ),
        'classPassed', (
          select count(*)::integer from public.challenge_submissions s
          join public.profiles p on p.id = s.user_id
          where s.challenge_id = c.id and s.passed and p.classe = v_classe
        ),
        'classSize', v_size
      ) as item
      from public.challenges c
      where c.opens_at <= now() and v_classe = any (c.classes)
      order by c.opens_at desc
      limit 60
    ) listed
  ), '[]'::jsonb);
end;
$$;

-- Défi ouvert pas encore réussi : pastille de la barre du site.
create or replace function public.challenge_pending_count()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.challenges c
  join public.profiles p on p.id = (select auth.uid())
  where p.classe is not null
    and p.classe = any (c.classes)
    and c.opens_at <= now() and now() < c.closes_at
    and not exists (
      select 1 from public.challenge_submissions s
      where s.challenge_id = c.id and s.user_id = p.id and s.passed
    );
$$;

revoke all on function public.challenge_list_mine() from public, anon;
revoke all on function public.challenge_pending_count() from public, anon;
grant execute on function public.challenge_list_mine() to authenticated;
grant execute on function public.challenge_pending_count() to authenticated;
