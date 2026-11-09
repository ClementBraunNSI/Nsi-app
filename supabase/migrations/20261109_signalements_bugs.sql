-- Signalements de bugs par les élèves connectés : un texte, la page concernée et une capture d'écran facultative.
-- L'élève écrit par bug_report_create (contrôles de taille, 10 signalements par jour au plus) et relit les siens ;
-- l'enseignant (compte admin ou enseignant) lit, classe et supprime tout.

create table if not exists public.bug_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  page text check (page is null or char_length(page) <= 300),
  message text not null check (char_length(message) between 5 and 3000),
  -- Image réduite et compressée dans le navigateur, en data URL (comme les captures des évaluations).
  screenshot text check (screenshot is null or (screenshot like 'data:image/%' and char_length(screenshot) <= 2000000)),
  -- Pour lister les signalements sans charger les images.
  has_screenshot boolean generated always as (screenshot is not null) stored,
  -- Navigateur et taille d'écran, pour reproduire le bug.
  context jsonb not null default '{}'::jsonb check (pg_column_size(context) <= 4000),
  status text not null default 'nouveau' check (status in ('nouveau', 'vu', 'corrige', 'ecarte')),
  note text check (note is null or char_length(note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bug_reports_status_idx on public.bug_reports (status, created_at desc);
create index if not exists bug_reports_user_idx on public.bug_reports (user_id, created_at desc);

alter table public.bug_reports enable row level security;

drop policy if exists bug_reports_select on public.bug_reports;
create policy bug_reports_select on public.bug_reports for select to authenticated
  using ((select auth.uid()) = user_id or (select private.is_elevated()));

drop policy if exists bug_reports_teacher_update on public.bug_reports;
create policy bug_reports_teacher_update on public.bug_reports for update to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

drop policy if exists bug_reports_teacher_delete on public.bug_reports;
create policy bug_reports_teacher_delete on public.bug_reports for delete to authenticated
  using ((select private.is_elevated()));

-- Envoi d'un signalement par l'élève connecté ; renvoie l'identifiant du signalement.
create or replace function public.bug_report_create(p_page text, p_message text, p_screenshot text, p_context jsonb)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_message text := btrim(coalesce(p_message, ''));
  v_id uuid;
begin
  if v_uid is null then
    raise exception 'Connexion nécessaire pour signaler un bug.';
  end if;
  if char_length(v_message) < 5 then
    raise exception 'Décrire le bug en quelques mots.';
  end if;
  if (select count(*) from public.bug_reports b where b.user_id = v_uid and b.created_at > now() - interval '1 day') >= 10 then
    raise exception 'Trop de signalements aujourd''hui : réessayer demain.';
  end if;

  insert into public.bug_reports (user_id, page, message, screenshot, context)
  values (
    v_uid,
    nullif(left(btrim(coalesce(p_page, '')), 300), ''),
    left(v_message, 3000),
    nullif(p_screenshot, ''),
    coalesce(p_context, '{}'::jsonb)
  )
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.bug_report_create(text, text, text, jsonb) from public, anon;
grant execute on function public.bug_report_create(text, text, text, jsonb) to authenticated;
