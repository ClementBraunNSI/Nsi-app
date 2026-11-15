-- Fiches données à des élèves précis, sur le moteur des évaluations :
-- - « rattrapage » : après une interrogation sous 12, passée comme une évaluation (page verrouillée, sans indices) ;
-- - « travail » : fiche particulière écrite par l'enseignant, sans verrouillage.
-- Une fiche vise des élèves (students) au lieu de classes ; elle n'entre ni dans les moyennes ni dans les statistiques de classe.

alter table public.evaluations
  add column if not exists kind text not null default 'evaluation' check (kind in ('evaluation', 'rattrapage', 'travail')),
  add column if not exists students uuid[] not null default '{}',
  -- Rattrapage : l'interrogation qui l'a motivé (pour ne pas le proposer deux fois).
  add column if not exists from_evaluation uuid references public.evaluations (id) on delete set null;

create index if not exists evaluations_students_idx on public.evaluations using gin (students);

-- L'élève est-il concerné : sa classe est visée, ou lui-même.
create or replace function private.eval_targets(p_eval public.evaluations, p_uid uuid, p_classe text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select (p_classe is not null and p_classe = any (p_eval.classes)) or p_uid = any (p_eval.students);
$$;

-- Liste de l'élève : on y ajoute le type de fiche.
drop function if exists public.eval_list_mine();
create function public.eval_list_mine()
returns table (
  id uuid,
  title text,
  description text,
  duration_minutes integer,
  evaluation_status text,
  attempt_status text,
  locked boolean,
  started_at timestamptz,
  submitted_at timestamptz,
  grade numeric,
  kind text
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
    select e.id, e.title, e.description, e.duration_minutes, e.status, a.status, coalesce(a.locked, false), a.started_at, a.submitted_at,
      case when e.status = 'fermee' and a.status = 'rendue' then (a.result ->> 'total')::numeric end,
      e.kind
    from public.evaluations e
    left join public.evaluation_attempts a on a.evaluation_id = e.id and a.user_id = v_uid
    where e.status <> 'brouillon'
      and ((e.status = 'ouverte' and private.eval_targets(e, v_uid, v_classe)) or a.id is not null)
    order by e.created_at desc;
end;
$$;

revoke all on function public.eval_list_mine() from public, anon;
grant execute on function public.eval_list_mine() to authenticated;

-- Début : la classe de l'élève, ou l'élève lui-même, doit être visé.
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
  if not found or v_eval.status <> 'ouverte' or not private.eval_targets(v_eval, v_uid, v_classe) then
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

-- Ce que l'élève voit : comme avant, plus le type de fiche (le verrouillage en dépend).
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
    if v_eval.status <> 'ouverte' or not private.eval_targets(v_eval, v_uid, v_classe) then
      return null;
    end if;
    return jsonb_build_object(
      'evaluation', jsonb_build_object('id', v_eval.id, 'title', v_eval.title, 'description', v_eval.description,
        'durationMinutes', v_eval.duration_minutes, 'status', v_eval.status, 'kind', v_eval.kind),
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
      'durationMinutes', v_eval.duration_minutes, 'status', v_eval.status, 'kind', v_eval.kind),
    'attempt', jsonb_build_object('id', v_attempt.id, 'status', v_attempt.status, 'locked', v_attempt.locked,
      'lockReason', case when v_attempt.locked then private.eval_lock_reason(v_attempt.id) end,
      'startedAt', v_attempt.started_at, 'submittedAt', v_attempt.submitted_at,
      'deadline', private.eval_deadline(v_attempt.started_at, v_eval.duration_minutes)),
    'exercises', coalesce(v_exercises, '[]'::jsonb),
    'answers', v_answers
  );
end;
$$;
