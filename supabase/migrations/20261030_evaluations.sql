-- Évaluations pratiques en classe : sujets cachés tirés au hasard, code enregistré, verrouillage anti-triche.
-- Les élèves n'ont aucun accès direct à ces tables : tout passe par les fonctions eval_* (security definer),
-- qui ne renvoient que le sujet de l'élève, sans les tests, la correction ni le code de déverrouillage.
-- Admin et enseignant : accès complet par RLS (création des sujets, suivi, correction automatique).

create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  description text not null default '' check (char_length(description) <= 4000),
  -- Classes concernées, comme profiles.classe (ex. 1NSI1).
  classes text[] not null default '{}',
  -- brouillon : invisible des élèves ; ouverte : en cours ; fermee : terminée, copies rendues.
  status text not null default 'brouillon' check (status in ('brouillon', 'ouverte', 'fermee')),
  -- Durée par élève à partir de son début, ou null pour aucune limite.
  duration_minutes integer check (duration_minutes is null or duration_minutes between 5 and 600),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  opened_at timestamptz,
  closed_at timestamptz
);

create table if not exists public.evaluation_subjects (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null references public.evaluations (id) on delete cascade,
  label text not null check (char_length(label) between 1 and 120),
  -- Texte écrit par l'enseignant (même format que les fiches : <ExerciseSection>, <Enonce>, <Verification>…).
  source text not null check (char_length(source) <= 200000),
  -- Partie envoyée à l'élève : [{ id, label, type, statement, starter, sqlSetup, packages }].
  exercises jsonb not null default '[]'::jsonb,
  -- Partie réservée à l'enseignant : [{ id, verification, correction }].
  grading jsonb not null default '[]'::jsonb,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists evaluation_subjects_evaluation_idx on public.evaluation_subjects (evaluation_id, position);

create table if not exists public.evaluation_attempts (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null references public.evaluations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id uuid not null references public.evaluation_subjects (id) on delete restrict,
  status text not null default 'en_cours' check (status in ('en_cours', 'rendue')),
  locked boolean not null default false,
  locked_at timestamptz,
  -- Code que l'enseignant saisit sur le poste de l'élève pour déverrouiller (un par élève et par évaluation).
  unlock_code text not null,
  failed_unlocks integer not null default 0,
  last_failed_unlock_at timestamptz,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz,
  submitted_at timestamptz,
  unique (evaluation_id, user_id)
);

create index if not exists evaluation_attempts_user_idx on public.evaluation_attempts (user_id);
create index if not exists evaluation_attempts_subject_idx on public.evaluation_attempts (subject_id);

create table if not exists public.evaluation_answers (
  attempt_id uuid not null references public.evaluation_attempts (id) on delete cascade,
  exercise_id text not null check (char_length(exercise_id) <= 200),
  code text not null default '' check (char_length(code) <= 60000),
  updated_at timestamptz not null default now(),
  -- Correction automatique, lancée depuis le tableau de bord de l'enseignant.
  graded_at timestamptz,
  passed boolean,
  tests_passed integer,
  tests_total integer,
  report jsonb,
  primary key (attempt_id, exercise_id)
);

create table if not exists public.evaluation_incidents (
  id bigint generated always as identity primary key,
  attempt_id uuid not null references public.evaluation_attempts (id) on delete cascade,
  kind text not null check (kind in ('onglet', 'application', 'collage', 'depot', 'double_onglet', 'partage_arrete', 'fermeture', 'reprise')),
  detail text not null default '' check (char_length(detail) <= 20000),
  -- Capture de l'écran partagé au moment de l'incident (data URL JPEG), si l'élève partageait son écran.
  screenshot text check (screenshot is null or char_length(screenshot) <= 1500000),
  locks boolean not null default false,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists evaluation_incidents_attempt_idx on public.evaluation_incidents (attempt_id, created_at);

alter table public.evaluations enable row level security;
alter table public.evaluation_subjects enable row level security;
alter table public.evaluation_attempts enable row level security;
alter table public.evaluation_answers enable row level security;
alter table public.evaluation_incidents enable row level security;

drop policy if exists evaluations_elevated on public.evaluations;
create policy evaluations_elevated on public.evaluations for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

drop policy if exists evaluation_subjects_elevated on public.evaluation_subjects;
create policy evaluation_subjects_elevated on public.evaluation_subjects for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

drop policy if exists evaluation_attempts_elevated on public.evaluation_attempts;
create policy evaluation_attempts_elevated on public.evaluation_attempts for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

drop policy if exists evaluation_answers_elevated on public.evaluation_answers;
create policy evaluation_answers_elevated on public.evaluation_answers for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

drop policy if exists evaluation_incidents_elevated on public.evaluation_incidents;
create policy evaluation_incidents_elevated on public.evaluation_incidents for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

-- Code de déverrouillage : 6 caractères sans ambiguïté (pas de 0/O, 1/I/L).
create or replace function private.eval_unlock_code()
returns text
language sql
volatile
set search_path = ''
as $$
  select string_agg(substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', (get_byte(r.b, i) % 31) + 1, 1), '' order by i)
  from (select extensions.gen_random_bytes(6) as b) r, generate_series(0, 5) as i;
$$;

-- Fin du temps imparti pour une tentative, ou null sans limite.
create or replace function private.eval_deadline(p_started timestamptz, p_minutes integer)
returns timestamptz
language sql
immutable
set search_path = ''
as $$
  select case when p_minutes is null then null else p_started + make_interval(mins => p_minutes) end;
$$;

-- Tentative de l'élève connecté, verrouillée pour la mise à jour.
create or replace function private.eval_own_attempt(p_attempt uuid)
returns public.evaluation_attempts
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.evaluation_attempts;
begin
  select * into v_attempt from public.evaluation_attempts
  where id = p_attempt and user_id = (select auth.uid())
  for update;
  if not found then
    raise exception 'tentative introuvable' using errcode = 'P0002';
  end if;
  return v_attempt;
end;
$$;

-- Rend la copie si le temps est écoulé ou si l'évaluation est fermée.
create or replace function private.eval_close_if_over(p_attempt public.evaluation_attempts)
returns public.evaluation_attempts
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_eval public.evaluations;
  v_deadline timestamptz;
  v_attempt public.evaluation_attempts := p_attempt;
begin
  if v_attempt.status <> 'en_cours' then
    return v_attempt;
  end if;
  select * into v_eval from public.evaluations where id = v_attempt.evaluation_id;
  v_deadline := private.eval_deadline(v_attempt.started_at, v_eval.duration_minutes);
  if v_eval.status = 'fermee' or (v_deadline is not null and now() > v_deadline + interval '2 minutes') then
    update public.evaluation_attempts
      set status = 'rendue', submitted_at = coalesce(v_deadline, now()), locked = false
      where id = v_attempt.id
      returning * into v_attempt;
  end if;
  return v_attempt;
end;
$$;

-- Nombre d'évaluations à faire (élève) ou de copies verrouillées à débloquer (enseignant), pour la barre du site.
create or replace function public.eval_pending_count()
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_classe text;
begin
  if v_uid is null then
    return 0;
  end if;
  if private.is_elevated() then
    return (
      select count(*)::integer
      from public.evaluation_attempts a
      join public.evaluations e on e.id = a.evaluation_id
      where e.status = 'ouverte' and a.status = 'en_cours' and a.locked
    );
  end if;
  select classe into v_classe from public.profiles where id = v_uid;
  if v_classe is null then
    return 0;
  end if;
  return (
    select count(*)::integer
    from public.evaluations e
    where e.status = 'ouverte'
      and v_classe = any (e.classes)
      and not exists (
        select 1 from public.evaluation_attempts a
        where a.evaluation_id = e.id and a.user_id = v_uid and a.status = 'rendue'
      )
  );
end;
$$;

-- Évaluations de l'élève : ouvertes pour sa classe, plus celles qu'il a déjà rendues.
create or replace function public.eval_list_mine()
returns table (
  id uuid,
  title text,
  description text,
  duration_minutes integer,
  evaluation_status text,
  attempt_status text,
  locked boolean,
  started_at timestamptz,
  submitted_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_classe text;
begin
  if v_uid is null then
    return;
  end if;
  select p.classe into v_classe from public.profiles p where p.id = v_uid;
  return query
    select e.id, e.title, e.description, e.duration_minutes, e.status, a.status, coalesce(a.locked, false), a.started_at, a.submitted_at
    from public.evaluations e
    left join public.evaluation_attempts a on a.evaluation_id = e.id and a.user_id = v_uid
    where e.status <> 'brouillon'
      and ((e.status = 'ouverte' and v_classe is not null and v_classe = any (e.classes)) or a.id is not null)
    order by e.created_at desc;
end;
$$;

-- Début de l'évaluation : un sujet tiré au hasard (le moins distribué, au hasard parmi les ex aequo).
create or replace function public.eval_start(p_evaluation uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_classe text;
  v_eval public.evaluations;
  v_attempt uuid;
  v_subject uuid;
begin
  if v_uid is null then
    raise exception 'connexion requise' using errcode = '42501';
  end if;
  select classe into v_classe from public.profiles where id = v_uid;
  select * into v_eval from public.evaluations where id = p_evaluation;
  if not found or v_eval.status <> 'ouverte' or v_classe is null or not (v_classe = any (v_eval.classes)) then
    raise exception 'évaluation indisponible' using errcode = 'P0002';
  end if;

  select a.id into v_attempt from public.evaluation_attempts a where a.evaluation_id = p_evaluation and a.user_id = v_uid;
  if found then
    return v_attempt;
  end if;

  select s.id into v_subject
  from public.evaluation_subjects s
  left join public.evaluation_attempts a on a.subject_id = s.id
  where s.evaluation_id = p_evaluation and jsonb_array_length(s.exercises) > 0
  group by s.id
  order by count(a.id), random()
  limit 1;
  if v_subject is null then
    raise exception 'aucun sujet' using errcode = 'P0002';
  end if;

  insert into public.evaluation_attempts (evaluation_id, user_id, subject_id, unlock_code, last_seen_at)
  values (p_evaluation, v_uid, v_subject, private.eval_unlock_code(), now())
  on conflict (evaluation_id, user_id) do nothing
  returning id into v_attempt;
  if v_attempt is null then
    select a.id into v_attempt from public.evaluation_attempts a where a.evaluation_id = p_evaluation and a.user_id = v_uid;
  end if;
  return v_attempt;
end;
$$;

-- Ce que l'élève voit : l'évaluation, sa tentative, son sujet (sans tests) et son code enregistré.
create or replace function public.eval_my_attempt(p_evaluation uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_classe text;
  v_eval public.evaluations;
  v_attempt public.evaluation_attempts;
  v_exercises jsonb;
  v_answers jsonb;
begin
  if v_uid is null then
    return null;
  end if;
  select * into v_eval from public.evaluations where id = p_evaluation;
  if not found or v_eval.status = 'brouillon' then
    return null;
  end if;
  select * into v_attempt from public.evaluation_attempts where evaluation_id = p_evaluation and user_id = v_uid for update;
  if not found then
    select classe into v_classe from public.profiles where id = v_uid;
    if v_eval.status <> 'ouverte' or v_classe is null or not (v_classe = any (v_eval.classes)) then
      return null;
    end if;
    return jsonb_build_object(
      'evaluation', jsonb_build_object('id', v_eval.id, 'title', v_eval.title, 'description', v_eval.description,
        'durationMinutes', v_eval.duration_minutes, 'status', v_eval.status),
      'attempt', null
    );
  end if;

  v_attempt := private.eval_close_if_over(v_attempt);
  select s.exercises into v_exercises from public.evaluation_subjects s where s.id = v_attempt.subject_id;
  select coalesce(jsonb_agg(jsonb_build_object('exerciseId', ans.exercise_id, 'code', ans.code)), '[]'::jsonb)
    into v_answers
  from public.evaluation_answers ans where ans.attempt_id = v_attempt.id;

  return jsonb_build_object(
    'evaluation', jsonb_build_object('id', v_eval.id, 'title', v_eval.title, 'description', v_eval.description,
      'durationMinutes', v_eval.duration_minutes, 'status', v_eval.status),
    'attempt', jsonb_build_object('id', v_attempt.id, 'status', v_attempt.status, 'locked', v_attempt.locked,
      'startedAt', v_attempt.started_at, 'submittedAt', v_attempt.submitted_at,
      'deadline', private.eval_deadline(v_attempt.started_at, v_eval.duration_minutes)),
    'exercises', coalesce(v_exercises, '[]'::jsonb),
    'answers', v_answers
  );
end;
$$;

-- Enregistrement du code d'un exercice (sauvegarde automatique pendant l'évaluation).
create or replace function public.eval_save_answer(p_attempt uuid, p_exercise text, p_code text)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.evaluation_attempts;
  v_now timestamptz := now();
begin
  v_attempt := private.eval_close_if_over(private.eval_own_attempt(p_attempt));
  if v_attempt.status <> 'en_cours' then
    raise exception 'copie rendue' using errcode = '42501';
  end if;
  if v_attempt.locked then
    raise exception 'évaluation verrouillée' using errcode = '42501';
  end if;
  if char_length(coalesce(p_code, '')) > 60000 then
    raise exception 'code trop long' using errcode = '22001';
  end if;
  if not exists (
    select 1 from public.evaluation_subjects s, jsonb_array_elements(s.exercises) x
    where s.id = v_attempt.subject_id and x ->> 'id' = p_exercise
  ) then
    raise exception 'exercice inconnu' using errcode = 'P0002';
  end if;

  insert into public.evaluation_answers (attempt_id, exercise_id, code, updated_at)
  values (v_attempt.id, p_exercise, coalesce(p_code, ''), v_now)
  on conflict (attempt_id, exercise_id) do update set code = excluded.code, updated_at = excluded.updated_at;
  update public.evaluation_attempts set last_seen_at = v_now where id = v_attempt.id;
  return v_now;
end;
$$;

-- Présence de l'élève, et état à jour (déverrouillage à distance, fermeture, temps écoulé).
create or replace function public.eval_heartbeat(p_attempt uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.evaluation_attempts;
  v_status text;
begin
  v_attempt := private.eval_close_if_over(private.eval_own_attempt(p_attempt));
  if v_attempt.status = 'en_cours' then
    update public.evaluation_attempts set last_seen_at = now() where id = v_attempt.id;
  end if;
  select status into v_status from public.evaluations where id = v_attempt.evaluation_id;
  return jsonb_build_object('locked', v_attempt.locked, 'status', v_attempt.status, 'evaluationStatus', v_status);
end;
$$;

-- Incident signalé par la page : changement d'onglet ou d'application, collage, second onglet, partage arrêté
-- (verrouillent), page fermée ou rouverte (notés seulement : extinction du poste ou plantage du navigateur).
create or replace function public.eval_report_incident(p_attempt uuid, p_kind text, p_detail text default '')
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.evaluation_attempts;
  v_locks boolean;
  v_detail text := left(coalesce(p_detail, ''), 20000);
  v_id bigint;
  v_absence integer;
begin
  v_attempt := private.eval_own_attempt(p_attempt);
  if v_attempt.status <> 'en_cours' then
    return null;
  end if;
  if p_kind not in ('onglet', 'application', 'collage', 'depot', 'double_onglet', 'partage_arrete', 'fermeture', 'reprise') then
    raise exception 'incident inconnu' using errcode = '22023';
  end if;
  v_locks := p_kind not in ('fermeture', 'reprise');

  -- Un même incident répété en rafale n'est noté qu'une fois.
  select i.id into v_id from public.evaluation_incidents i
  where i.attempt_id = v_attempt.id and i.kind = p_kind and i.created_at > now() - interval '3 seconds'
  order by i.created_at desc limit 1;
  if v_id is not null then
    return v_id;
  end if;
  if (select count(*) from public.evaluation_incidents i where i.attempt_id = v_attempt.id) >= 300 then
    return null;
  end if;

  if p_kind = 'reprise' and v_attempt.last_seen_at is not null then
    v_absence := greatest(0, extract(epoch from now() - v_attempt.last_seen_at)::integer);
    v_detail := trim(both ' ' from format('Page rouverte après %s sans signe de vie. %s',
      case when v_absence < 60 then v_absence || ' s' else (v_absence / 60) || ' min ' || (v_absence % 60) || ' s' end,
      v_detail));
  end if;

  insert into public.evaluation_incidents (attempt_id, kind, detail, locks)
  values (v_attempt.id, p_kind, v_detail, v_locks)
  returning id into v_id;

  if v_locks then
    update public.evaluation_attempts
      set locked = true, locked_at = case when locked then locked_at else now() end, last_seen_at = now()
      where id = v_attempt.id;
  else
    update public.evaluation_attempts set last_seen_at = now() where id = v_attempt.id;
  end if;
  return v_id;
end;
$$;

-- Capture de l'écran jointe à un incident, dans les deux minutes qui suivent.
create or replace function public.eval_attach_screenshot(p_incident bigint, p_image text)
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
  update public.evaluation_incidents i
    set screenshot = p_image
    from public.evaluation_attempts a
    where i.id = p_incident
      and a.id = i.attempt_id
      and a.user_id = (select auth.uid())
      and i.screenshot is null
      and i.created_at > now() - interval '2 minutes';
  return found;
end;
$$;

-- Déverrouillage sur le poste de l'élève : l'enseignant saisit le code ; la page affiche alors les incidents.
create or replace function public.eval_unlock(p_attempt uuid, p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.evaluation_attempts;
  v_incidents jsonb;
begin
  v_attempt := private.eval_own_attempt(p_attempt);
  if not v_attempt.locked then
    return jsonb_build_object('status', 'deverrouillee', 'incidents', '[]'::jsonb);
  end if;
  if v_attempt.failed_unlocks >= 5 and v_attempt.last_failed_unlock_at > now() - interval '1 minute' then
    return jsonb_build_object('status', 'attente');
  end if;
  if upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g')) <> v_attempt.unlock_code then
    update public.evaluation_attempts
      set failed_unlocks = failed_unlocks + 1, last_failed_unlock_at = now()
      where id = v_attempt.id;
    return jsonb_build_object('status', 'refuse');
  end if;

  update public.evaluation_attempts set locked = false, failed_unlocks = 0, last_seen_at = now() where id = v_attempt.id;
  with resolved as (
    update public.evaluation_incidents
      set resolved_at = now()
      where attempt_id = v_attempt.id and resolved_at is null
      returning kind, detail, screenshot, created_at
  )
  select coalesce(jsonb_agg(jsonb_build_object('kind', kind, 'detail', detail, 'screenshot', screenshot, 'createdAt', created_at)
    order by created_at), '[]'::jsonb)
    into v_incidents
  from resolved;
  return jsonb_build_object('status', 'ok', 'incidents', v_incidents);
end;
$$;

-- L'élève rend sa copie.
create or replace function public.eval_submit(p_attempt uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.evaluation_attempts;
begin
  v_attempt := private.eval_close_if_over(private.eval_own_attempt(p_attempt));
  if v_attempt.status <> 'en_cours' then
    return true;
  end if;
  if v_attempt.locked then
    raise exception 'évaluation verrouillée' using errcode = '42501';
  end if;
  update public.evaluation_attempts set status = 'rendue', submitted_at = now() where id = v_attempt.id;
  return true;
end;
$$;

revoke all on function private.eval_unlock_code() from public, anon, authenticated;
revoke all on function private.eval_deadline(timestamptz, integer) from public, anon;
revoke all on function private.eval_own_attempt(uuid) from public, anon, authenticated;
revoke all on function private.eval_close_if_over(public.evaluation_attempts) from public, anon, authenticated;

revoke all on function public.eval_pending_count() from public, anon;
revoke all on function public.eval_list_mine() from public, anon;
revoke all on function public.eval_start(uuid) from public, anon;
revoke all on function public.eval_my_attempt(uuid) from public, anon;
revoke all on function public.eval_save_answer(uuid, text, text) from public, anon;
revoke all on function public.eval_heartbeat(uuid) from public, anon;
revoke all on function public.eval_report_incident(uuid, text, text) from public, anon;
revoke all on function public.eval_attach_screenshot(bigint, text) from public, anon;
revoke all on function public.eval_unlock(uuid, text) from public, anon;
revoke all on function public.eval_submit(uuid) from public, anon;

grant execute on function public.eval_pending_count() to authenticated;
grant execute on function public.eval_list_mine() to authenticated;
grant execute on function public.eval_start(uuid) to authenticated;
grant execute on function public.eval_my_attempt(uuid) to authenticated;
grant execute on function public.eval_save_answer(uuid, text, text) to authenticated;
grant execute on function public.eval_heartbeat(uuid) to authenticated;
grant execute on function public.eval_report_incident(uuid, text, text) to authenticated;
grant execute on function public.eval_attach_screenshot(bigint, text) to authenticated;
grant execute on function public.eval_unlock(uuid, text) to authenticated;
grant execute on function public.eval_submit(uuid) to authenticated;
