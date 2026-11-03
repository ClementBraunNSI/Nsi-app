-- Défi du lundi, troisième version : la surveillance des évaluations pratiques.
-- Changement d'onglet ou d'application, collage venu d'ailleurs, second onglet, partage d'écran arrêté :
-- la page se verrouille, l'incident est noté (avec une capture de l'écran partagé) et l'enseignant débloque
-- avec un code, sur le poste de l'élève ou à distance. Mêmes règles que eval_* (20261030_evaluations.sql).
-- Les défis déjà programmés restent sans surveillance ; les nouveaux l'ont par défaut.

alter table public.challenges add column if not exists proctored boolean not null default false;
alter table public.challenges alter column proctored set default true;

alter table public.challenge_submissions add column if not exists locked boolean not null default false;
alter table public.challenge_submissions add column if not exists locked_at timestamptz;
-- Code saisi par l'enseignant pour déverrouiller : un nouveau à chaque verrouillage.
alter table public.challenge_submissions add column if not exists unlock_code text;
alter table public.challenge_submissions add column if not exists failed_unlocks integer not null default 0;
alter table public.challenge_submissions add column if not exists last_failed_unlock_at timestamptz;
alter table public.challenge_submissions add column if not exists last_seen_at timestamptz;
-- L'élève arrête le défi avant la fin du temps : plus rien n'est enregistré, la surveillance s'arrête.
alter table public.challenge_submissions add column if not exists finished_at timestamptz;

create table if not exists public.challenge_incidents (
  id bigint generated always as identity primary key,
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  user_id uuid not null,
  kind text not null check (kind in ('onglet', 'application', 'collage', 'depot', 'double_onglet', 'partage_arrete', 'fermeture', 'reprise')),
  detail text not null default '' check (char_length(detail) <= 20000),
  -- Capture de l'écran partagé au moment de l'incident (data URL JPEG), si l'élève partageait son écran.
  screenshot text check (screenshot is null or char_length(screenshot) <= 1500000),
  locks boolean not null default false,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  foreign key (challenge_id, user_id) references public.challenge_submissions (challenge_id, user_id) on delete cascade
);

create index if not exists challenge_incidents_submission_idx on public.challenge_incidents (challenge_id, user_id, created_at);

alter table public.challenge_incidents enable row level security;

drop policy if exists challenge_incidents_elevated on public.challenge_incidents;
create policy challenge_incidents_elevated on public.challenge_incidents for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

-- Cause du verrouillage en cours : le dernier incident qui verrouille, pas encore débloqué.
create or replace function private.challenge_lock_reason(p_challenge uuid, p_user uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select i.kind from public.challenge_incidents i
  where i.challenge_id = p_challenge and i.user_id = p_user and i.locks and i.resolved_at is null
  order by i.created_at desc, i.id desc
  limit 1;
$$;

-- Essai de l'élève connecté, verrouillé pour la mise à jour.
create or replace function private.challenge_own_submission(p_challenge uuid)
returns public.challenge_submissions
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sub public.challenge_submissions;
begin
  select * into v_sub from public.challenge_submissions
  where challenge_id = p_challenge and user_id = (select auth.uid())
  for update;
  if not found then
    raise exception 'défi pas commencé' using errcode = 'P0002';
  end if;
  return v_sub;
end;
$$;

-- Surveillance en cours : défi surveillé et ouvert, élève de la classe, ni réussi, ni arrêté, ni hors temps
-- (même marge de 30 secondes que la vérification, CHALLENGE_GRACE_MS).
create or replace function private.challenge_watched(p_sub public.challenge_submissions)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.challenges c
    join public.profiles p on p.id = p_sub.user_id
    where c.id = p_sub.challenge_id
      and c.proctored
      and p.role = 'student'
      and p.classe = any (c.classes)
      and c.opens_at <= now() and now() < c.closes_at
      and not p_sub.passed
      and p_sub.finished_at is null
      and (c.time_limit_minutes is null or p_sub.started_at is null
        or now() <= p_sub.started_at + make_interval(mins => c.time_limit_minutes) + interval '30 seconds')
  );
$$;

-- Incident signalé par la page : changement d'onglet ou d'application, collage, second onglet, partage arrêté
-- (verrouillent), page fermée ou rouverte (notés seulement : extinction du poste ou plantage du navigateur).
create or replace function public.challenge_report_incident(p_challenge uuid, p_kind text, p_detail text default '')
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sub public.challenge_submissions;
  v_locks boolean;
  v_detail text := left(coalesce(p_detail, ''), 20000);
  v_id bigint;
  v_absence integer;
begin
  v_sub := private.challenge_own_submission(p_challenge);
  if not private.challenge_watched(v_sub) then
    return null;
  end if;
  if p_kind not in ('onglet', 'application', 'collage', 'depot', 'double_onglet', 'partage_arrete', 'fermeture', 'reprise') then
    raise exception 'incident inconnu' using errcode = '22023';
  end if;
  v_locks := p_kind not in ('fermeture', 'reprise');

  -- Un même incident répété en rafale n'est noté qu'une fois.
  select i.id into v_id from public.challenge_incidents i
  where i.challenge_id = v_sub.challenge_id and i.user_id = v_sub.user_id
    and i.kind = p_kind and i.created_at > now() - interval '3 seconds'
  order by i.created_at desc limit 1;
  if v_id is not null then
    return v_id;
  end if;
  if (select count(*) from public.challenge_incidents i where i.challenge_id = v_sub.challenge_id and i.user_id = v_sub.user_id) >= 300 then
    return null;
  end if;

  if p_kind = 'reprise' and v_sub.last_seen_at is not null then
    v_absence := greatest(0, extract(epoch from now() - v_sub.last_seen_at)::integer);
    v_detail := trim(both ' ' from format('Page rouverte après %s sans signe de vie. %s',
      case when v_absence < 60 then v_absence || ' s' else (v_absence / 60) || ' min ' || (v_absence % 60) || ' s' end,
      v_detail));
  end if;

  insert into public.challenge_incidents (challenge_id, user_id, kind, detail, locks)
  values (v_sub.challenge_id, v_sub.user_id, p_kind, v_detail, v_locks)
  returning id into v_id;

  if v_locks then
    -- Nouveau code à chaque manipulation : un code vu une fois ne resservira pas.
    update public.challenge_submissions
      set locked = true, locked_at = case when locked then locked_at else now() end, last_seen_at = now(),
          unlock_code = private.eval_unlock_code(), failed_unlocks = 0
      where challenge_id = v_sub.challenge_id and user_id = v_sub.user_id;
  else
    update public.challenge_submissions set last_seen_at = now()
      where challenge_id = v_sub.challenge_id and user_id = v_sub.user_id;
  end if;
  return v_id;
end;
$$;

-- Capture de l'écran jointe à un incident, dans les deux minutes qui suivent.
create or replace function public.challenge_attach_screenshot(p_incident bigint, p_image text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_image is null or char_length(p_image) > 1500000
     or not (p_image like 'data:image/jpeg;base64,%' or p_image like 'data:image/png;base64,%') then
    return false;
  end if;
  update public.challenge_incidents i
    set screenshot = p_image
    where i.id = p_incident
      and i.user_id = (select auth.uid())
      and i.screenshot is null
      and i.created_at > now() - interval '2 minutes';
  return found;
end;
$$;

-- Présence de l'élève, et état à jour (déverrouillage à distance par l'enseignant).
create or replace function public.challenge_heartbeat(p_challenge uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sub public.challenge_submissions;
begin
  v_sub := private.challenge_own_submission(p_challenge);
  update public.challenge_submissions set last_seen_at = now()
    where challenge_id = v_sub.challenge_id and user_id = v_sub.user_id;
  return jsonb_build_object('locked', v_sub.locked,
    'lockReason', case when v_sub.locked then private.challenge_lock_reason(v_sub.challenge_id, v_sub.user_id) end);
end;
$$;

-- Déverrouillage sur le poste de l'élève : l'enseignant saisit le code ; la page affiche alors les incidents.
create or replace function public.challenge_unlock(p_challenge uuid, p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sub public.challenge_submissions;
  v_incidents jsonb;
begin
  v_sub := private.challenge_own_submission(p_challenge);
  if not v_sub.locked then
    return jsonb_build_object('status', 'deverrouillee', 'incidents', '[]'::jsonb);
  end if;
  if v_sub.failed_unlocks >= 5 and v_sub.last_failed_unlock_at > now() - interval '1 minute' then
    return jsonb_build_object('status', 'attente');
  end if;
  if upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g')) <> coalesce(v_sub.unlock_code, '') then
    update public.challenge_submissions
      set failed_unlocks = failed_unlocks + 1, last_failed_unlock_at = now()
      where challenge_id = v_sub.challenge_id and user_id = v_sub.user_id;
    return jsonb_build_object('status', 'refuse');
  end if;

  update public.challenge_submissions set locked = false, failed_unlocks = 0, last_seen_at = now()
    where challenge_id = v_sub.challenge_id and user_id = v_sub.user_id;
  with resolved as (
    update public.challenge_incidents
      set resolved_at = now()
      where challenge_id = v_sub.challenge_id and user_id = v_sub.user_id and resolved_at is null
      returning kind, detail, screenshot, created_at
  )
  select coalesce(jsonb_agg(jsonb_build_object('kind', kind, 'detail', detail, 'screenshot', screenshot, 'createdAt', created_at)
    order by created_at), '[]'::jsonb)
    into v_incidents
  from resolved;
  return jsonb_build_object('status', 'ok', 'incidents', v_incidents);
end;
$$;

-- L'élève arrête le défi : ses essais restent, plus rien n'est enregistré ensuite.
create or replace function public.challenge_finish(p_challenge uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sub public.challenge_submissions;
begin
  v_sub := private.challenge_own_submission(p_challenge);
  if v_sub.locked then
    raise exception 'défi verrouillé' using errcode = '42501';
  end if;
  update public.challenge_submissions set finished_at = coalesce(finished_at, now())
    where challenge_id = v_sub.challenge_id and user_id = v_sub.user_id;
  return true;
end;
$$;

-- Défis de l'élève : la version précédente, plus la surveillance (défi surveillé, verrouillage, arrêt).
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
        'proctored', c.proctored,
        'exercises', c.exercises,
        'corrections', case when now() >= c.closes_at then (
          select coalesce(jsonb_agg(jsonb_build_object('id', g ->> 'id', 'correction', g ->> 'correction')), '[]'::jsonb)
          from jsonb_array_elements(c.grading) g
        ) end,
        'mine', (
          select jsonb_build_object(
            'code', s.code, 'attempts', s.attempts, 'passed', s.passed, 'firstPassedAt', s.first_passed_at,
            'startedAt', s.started_at, 'answers', s.answers, 'finishedAt', s.finished_at, 'locked', s.locked,
            'lockReason', case when s.locked then private.challenge_lock_reason(c.id, v_uid) end
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

revoke all on function private.challenge_lock_reason(uuid, uuid) from public, anon, authenticated;
revoke all on function private.challenge_own_submission(uuid) from public, anon, authenticated;
revoke all on function private.challenge_watched(public.challenge_submissions) from public, anon, authenticated;

revoke all on function public.challenge_report_incident(uuid, text, text) from public, anon;
revoke all on function public.challenge_attach_screenshot(bigint, text) from public, anon;
revoke all on function public.challenge_heartbeat(uuid) from public, anon;
revoke all on function public.challenge_unlock(uuid, text) from public, anon;
revoke all on function public.challenge_finish(uuid) from public, anon;

grant execute on function public.challenge_report_incident(uuid, text, text) to authenticated;
grant execute on function public.challenge_attach_screenshot(bigint, text) to authenticated;
grant execute on function public.challenge_heartbeat(uuid) to authenticated;
grant execute on function public.challenge_unlock(uuid, text) to authenticated;
grant execute on function public.challenge_finish(uuid) to authenticated;
