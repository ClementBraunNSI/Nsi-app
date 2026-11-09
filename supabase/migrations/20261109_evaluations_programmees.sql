-- Évaluations programmées : l'enseignant indique la date et l'heure de passage. Une évaluation « programmée »
-- reste invisible des élèves, puis s'ouvre d'elle-même à l'heure dite : eval_open_due la fait passer « ouverte »
-- dès qu'une page d'évaluation est chargée (élève ou enseignant). Les autres fonctions eval_* ne changent pas.

alter table public.evaluations add column if not exists scheduled_at timestamptz;

-- Nouveau statut « programmee » : on remplace la contrainte sur le statut, quel que soit son nom.
do $$
declare v_name text;
begin
  for v_name in
    select c.conname from pg_constraint c
    where c.conrelid = 'public.evaluations'::regclass and c.contype = 'c' and pg_get_constraintdef(c.oid) like '%status%'
  loop
    execute format('alter table public.evaluations drop constraint %I', v_name);
  end loop;
end $$;
alter table public.evaluations add constraint evaluations_status_check
  check (status in ('brouillon', 'programmee', 'ouverte', 'fermee'));
alter table public.evaluations add constraint evaluations_programmee_date
  check (status <> 'programmee' or scheduled_at is not null);

create index if not exists evaluations_due_idx on public.evaluations (scheduled_at) where status = 'programmee';

-- Ouvre les évaluations programmées dont l'heure est arrivée ; renvoie le nombre d'évaluations ouvertes.
create or replace function public.eval_open_due()
returns integer
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare v_count integer;
begin
  update public.evaluations
  set status = 'ouverte', opened_at = scheduled_at, closed_at = null
  where status = 'programmee' and scheduled_at <= now();
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.eval_open_due() from public, anon;
grant execute on function public.eval_open_due() to authenticated;
