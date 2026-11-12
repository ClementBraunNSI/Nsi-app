-- Résultats des évaluations pour les élèves. Quand l'enseignant a validé la note d'une copie, le site enregistre
-- avec la copie un résumé sans tests ni correction (lib/evaluation-result.ts) : note, points de chaque exercice,
-- messages des tests non réussis, notions à retravailler. L'élève le lit une fois l'évaluation fermée, avec la
-- moyenne, la médiane et les quartiles de sa classe (copies validées seulement, à partir de 5 copies).

alter table public.evaluation_attempts
  add column if not exists result jsonb check (result is null or octet_length(result::text) <= 100000);

-- Résultat de l'élève pour une évaluation fermée : null si l'évaluation n'est pas fermée ou s'il n'a pas de copie.
create or replace function public.eval_my_result(p_evaluation uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_eval public.evaluations;
  v_attempt public.evaluation_attempts;
  v_classe text;
  v_count integer;
  v_pending integer;
  v_mean numeric;
  v_q1 numeric;
  v_median numeric;
  v_q3 numeric;
begin
  if v_uid is null then
    return null;
  end if;
  select * into v_eval from public.evaluations where id = p_evaluation;
  if not found or v_eval.status <> 'fermee' then
    return null;
  end if;
  select * into v_attempt from public.evaluation_attempts where evaluation_id = p_evaluation and user_id = v_uid;
  if not found then
    return null;
  end if;
  select p.classe into v_classe from public.profiles p where p.id = v_uid;

  -- Copies rendues de la même classe (toutes les copies si l'élève n'a pas de classe).
  select
    count(c.total),
    count(*) - count(c.total),
    round(avg(c.total), 2),
    round((percentile_cont(0.25) within group (order by c.total))::numeric, 2),
    round((percentile_cont(0.5) within group (order by c.total))::numeric, 2),
    round((percentile_cont(0.75) within group (order by c.total))::numeric, 2)
  into v_count, v_pending, v_mean, v_q1, v_median, v_q3
  from (
    select (a.result ->> 'total')::numeric as total
    from public.evaluation_attempts a
    left join public.profiles p on p.id = a.user_id
    where a.evaluation_id = p_evaluation
      and a.status = 'rendue'
      and (v_classe is null or p.classe = v_classe)
  ) c;

  return jsonb_build_object(
    'evaluation', jsonb_build_object('id', v_eval.id, 'title', v_eval.title, 'closedAt', v_eval.closed_at),
    'submittedAt', v_attempt.submitted_at,
    'result', case when v_attempt.status = 'rendue' then v_attempt.result end,
    'stats', jsonb_build_object(
      'classe', v_classe,
      'count', v_count,
      'pending', v_pending,
      -- En dessous de 5 copies, les statistiques laisseraient deviner les notes des autres élèves.
      'mean', case when v_count >= 5 then v_mean end,
      'q1', case when v_count >= 5 then v_q1 end,
      'median', case when v_count >= 5 then v_median end,
      'q3', case when v_count >= 5 then v_q3 end
    )
  );
end;
$$;

revoke all on function public.eval_my_result(uuid) from public, anon;
grant execute on function public.eval_my_result(uuid) to authenticated;

-- La liste des évaluations de l'élève donne aussi sa note quand l'évaluation est fermée et la copie validée.
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
  grade numeric
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
      case when e.status = 'fermee' and a.status = 'rendue' then (a.result ->> 'total')::numeric end
    from public.evaluations e
    left join public.evaluation_attempts a on a.evaluation_id = e.id and a.user_id = v_uid
    where e.status <> 'brouillon'
      and ((e.status = 'ouverte' and v_classe is not null and v_classe = any (e.classes)) or a.id is not null)
    order by e.created_at desc;
end;
$$;

revoke all on function public.eval_list_mine() from public, anon;
grant execute on function public.eval_list_mine() to authenticated;
