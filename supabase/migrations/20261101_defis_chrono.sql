-- Défi du lundi, deuxième version : plusieurs exercices par défi et un temps limité par élève.
-- Le chrono part quand l'élève ouvre la page du défi (challenge_start) ; la vérification côté serveur
-- refuse d'enregistrer après started_at + time_limit_minutes. La table est encore vide : on renomme sans migrer.

alter table public.challenges rename column exercise to exercises;
alter table public.challenges alter column exercises set default '[]'::jsonb;
-- grading : [{ id, verification, correction }], dans l'ordre des exercices.
alter table public.challenges alter column grading set default '[]'::jsonb;
alter table public.challenges add column if not exists time_limit_minutes integer
  check (time_limit_minutes is null or time_limit_minutes between 1 and 240);

alter table public.challenge_submissions add column if not exists started_at timestamptz;
-- Réponses par exercice : { "<id>": { code, passed, attempts } }.
alter table public.challenge_submissions add column if not exists answers jsonb not null default '{}'::jsonb;

-- Défis de l'élève (ouverts pour sa classe), sans les tests ; corrections seulement après la fermeture.
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
        'timeLimitMinutes', c.time_limit_minutes,
        'exercises', c.exercises,
        'corrections', case when now() >= c.closes_at then (
          select coalesce(jsonb_agg(jsonb_build_object('id', g ->> 'id', 'correction', g ->> 'correction')), '[]'::jsonb)
          from jsonb_array_elements(c.grading) g
        ) end,
        'mine', (
          select jsonb_build_object(
            'code', s.code, 'attempts', s.attempts, 'passed', s.passed, 'firstPassedAt', s.first_passed_at,
            'startedAt', s.started_at, 'answers', s.answers
          )
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

-- Ouverture de la page par l'élève : démarre son chrono une seule fois et renvoie l'heure de départ.
create or replace function public.challenge_start(p_challenge uuid)
returns timestamptz
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_started timestamptz;
begin
  if v_uid is null then
    return null;
  end if;
  if not exists (
    select 1 from public.challenges c
    join public.profiles p on p.id = v_uid
    where c.id = p_challenge
      and p.role = 'student'
      and p.classe = any (c.classes)
      and c.opens_at <= now() and now() < c.closes_at
  ) then
    return null;
  end if;

  insert into public.challenge_submissions (challenge_id, user_id, started_at)
  values (p_challenge, v_uid, now())
  on conflict (challenge_id, user_id) do update
    set started_at = coalesce(public.challenge_submissions.started_at, excluded.started_at);

  select s.started_at into v_started
  from public.challenge_submissions s
  where s.challenge_id = p_challenge and s.user_id = v_uid;
  return v_started;
end;
$$;

revoke all on function public.challenge_start(uuid) from public, anon;
grant execute on function public.challenge_start(uuid) to authenticated;
