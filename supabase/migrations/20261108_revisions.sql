-- Outils de révision de l'espace élève : exercices à refaire avant une interro, carnet d'erreurs, entraînement chronométré.

-- 1. Fiches à réviser choisies par l'enseignant pour une interro ou un DS (facultatif : sinon, les chapitres
--    saisis en texte libre sont rapprochés des fiches par le site).
alter table public.class_assessments
  add column if not exists course_ids text[] not null default '{}'
  check (cardinality(course_ids) <= 30);

-- Interros et DS de la classe de l'élève dans les p_days prochains jours, avec les fiches choisies.
-- class_info_for reste inchangée : cette lecture ne sert qu'aux révisions.
create or replace function public.revision_assessments_mine(p_days integer default 14)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', a.id,
      'kind', a.kind,
      'title', a.title,
      'day', a.day,
      'time', to_char(a.at_time, 'HH24:MI'),
      'chapters', a.chapters,
      'courseIds', to_jsonb(a.course_ids)
    ) order by a.day, a.at_time nulls first), '[]'::jsonb)
  from public.profiles p
  join public.class_assessments a on p.classe is not null and p.classe = any (a.classes)
  where p.id = (select auth.uid())
    and p.role = 'student'
    and a.day >= (now() at time zone 'Europe/Paris')::date
    and a.day <= (now() at time zone 'Europe/Paris')::date + least(greatest(coalesce(p_days, 14), 0), 60);
$$;

revoke all on function public.revision_assessments_mine(integer) from public, anon;
grant execute on function public.revision_assessments_mine(integer) to authenticated;

-- 2. Carnet d'erreurs : résumé de l'erreur d'un essai refusé (type d'erreur Python, message, ou premier test raté).
--    Écrit par le serveur avec l'essai ; pour un essai plus ancien, calculé une fois à la demande puis gardé ici.
alter table public.exercise_submissions
  add column if not exists error jsonb
  check (error is null or pg_column_size(error) <= 6000);

-- 3. Entraînement chronométré : un sujet blanc tiré des fiches, sans note. L'enseignant voit seulement qu'il a eu lieu.
create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null check (char_length(label) between 1 and 200),
  exercise_ids text[] not null check (cardinality(exercise_ids) between 1 and 4),
  duration_minutes integer not null check (duration_minutes in (20, 30, 45)),
  solved text[] not null default '{}',
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index if not exists practice_sessions_user_idx on public.practice_sessions (user_id, started_at desc);

alter table public.practice_sessions enable row level security;

drop policy if exists practice_sessions_select_own_or_elevated on public.practice_sessions;
create policy practice_sessions_select_own_or_elevated on public.practice_sessions for select to authenticated
  using ((select auth.uid()) = user_id or (select private.is_elevated()));

-- Démarrage par l'élève (compte élève seulement, 30 sujets par jour au plus).
create or replace function public.practice_start(p_label text, p_exercise_ids text[], p_minutes integer)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_row public.practice_sessions;
begin
  if v_uid is null or not exists (select 1 from public.profiles p where p.id = v_uid and p.role = 'student') then
    return null;
  end if;
  if (select count(*) from public.practice_sessions s where s.user_id = v_uid and s.started_at > now() - interval '1 day') >= 30 then
    return null;
  end if;
  -- Un seul entraînement en cours : le précédent est clos.
  update public.practice_sessions set finished_at = now() where user_id = v_uid and finished_at is null;
  insert into public.practice_sessions (user_id, label, exercise_ids, duration_minutes)
  values (v_uid, left(trim(p_label), 200), p_exercise_ids, p_minutes)
  returning * into v_row;
  return jsonb_build_object('id', v_row.id, 'startedAt', v_row.started_at);
end;
$$;

-- Fin (bouton « Terminer » ou temps écoulé).
create or replace function public.practice_finish(p_id uuid)
returns void
language sql
volatile
security definer
set search_path = ''
as $$
  update public.practice_sessions
  set finished_at = least(now(), started_at + make_interval(mins => duration_minutes))
  where id = p_id and user_id = (select auth.uid()) and finished_at is null;
$$;

-- Exercice réussi pendant l'entraînement : appelé par le serveur après la vérification (clé de service).
create or replace function public.practice_mark_solved(p_user uuid, p_id uuid, p_exercise text)
returns boolean
language sql
volatile
security definer
set search_path = ''
as $$
  with updated as (
    update public.practice_sessions
    set solved = array_append(solved, p_exercise)
    where id = p_id and user_id = p_user and finished_at is null
      and p_exercise = any (exercise_ids) and not (p_exercise = any (solved))
      and now() <= started_at + make_interval(mins => duration_minutes) + interval '1 minute'
    returning 1
  )
  select exists (select 1 from updated);
$$;

revoke all on function public.practice_start(text, text[], integer) from public, anon;
revoke all on function public.practice_finish(uuid) from public, anon;
revoke all on function public.practice_mark_solved(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.practice_start(text, text[], integer) to authenticated;
grant execute on function public.practice_finish(uuid) to authenticated;
grant execute on function public.practice_mark_solved(uuid, uuid, text) to service_role;
