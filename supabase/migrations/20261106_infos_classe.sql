-- Informations de classe : dates d'interrogations et de DS, vue « Ma classe » de l'élève,
-- et lecture par l'extension de navigateur avec un jeton personnel.
-- Les devoirs de classe restent dans public.homework (une ligne par classe).

create table if not exists public.class_assessments (
  id uuid primary key default gen_random_uuid(),
  classes text[] not null check (cardinality(classes) between 1 and 40),
  kind text not null check (kind in ('interro', 'ds')),
  title text not null default '' check (char_length(title) <= 200),
  -- Jour de l'épreuve (heure de Paris) ; l'heure est facultative.
  day date not null,
  at_time time,
  chapters text not null default '' check (char_length(chapters) <= 1000),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists class_assessments_classes_idx on public.class_assessments using gin (classes);
create index if not exists class_assessments_day_idx on public.class_assessments (day);
create index if not exists class_assessments_created_by_idx on public.class_assessments (created_by);

-- Jeton de l'extension : seule son empreinte sha256 est gardée. Un jeton par élève, révocable.
create table if not exists public.extension_tokens (
  user_id uuid primary key references auth.users (id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now()
);

alter table public.class_assessments enable row level security;
alter table public.extension_tokens enable row level security;

drop policy if exists class_assessments_elevated on public.class_assessments;
create policy class_assessments_elevated on public.class_assessments for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

drop policy if exists extension_tokens_elevated on public.extension_tokens;
create policy extension_tokens_elevated on public.extension_tokens for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

-- Informations de la classe d'un élève : devoirs à faire, interros et DS à venir, annonces non lues.
-- Interne : appelée par class_info_mine (session du site) et extension_class_info (jeton).
create or replace function private.class_info_for(p_uid uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_classe text;
  v_read timestamptz;
  v_today date := (now() at time zone 'Europe/Paris')::date;
begin
  if p_uid is null or not exists (select 1 from public.profiles p where p.id = p_uid and p.role = 'student') then
    return null;
  end if;
  select p.classe into v_classe from public.profiles p where p.id = p_uid;
  select r.last_read_at into v_read from public.class_announcement_reads r where r.user_id = p_uid;

  return jsonb_build_object(
    'classe', v_classe,
    'homework', coalesce((
      select jsonb_agg(item order by item ->> 'dueAt' nulls last)
      from (
        select jsonb_build_object(
          'id', h.id,
          'title', h.title,
          'description', h.description,
          'dueAt', h.due_at,
          'pagePath', h.page_path,
          'pageTitle', h.page_title,
          'done', case
            when h.student_id is not null then h.status = 'done'
            else exists (select 1 from public.homework_completions c where c.homework_id = h.id and c.user_id = p_uid)
          end
        ) as item
        from public.homework h
        where (h.student_id = p_uid or (h.student_id is null and v_classe is not null and h.classe = v_classe))
          and (h.due_at is null or h.due_at >= now() - interval '1 day')
        order by h.due_at nulls last
        limit 40
      ) listed
    ), '[]'::jsonb),
    'assessments', coalesce((
      select jsonb_agg(item order by item ->> 'day', item ->> 'time' nulls first)
      from (
        select jsonb_build_object(
          'id', a.id,
          'kind', a.kind,
          'title', a.title,
          'day', a.day,
          'time', to_char(a.at_time, 'HH24:MI'),
          'chapters', a.chapters
        ) as item
        from public.class_assessments a
        where v_classe is not null and v_classe = any (a.classes) and a.day >= v_today
        order by a.day, a.at_time nulls first
        limit 20
      ) listed
    ), '[]'::jsonb),
    'unread', (
      select count(*)::integer from public.class_announcements a
      where v_classe is not null and v_classe = any (a.classes)
        and (v_read is null or a.created_at > v_read)
    ),
    'lastAnnouncement', (
      select jsonb_build_object('id', a.id, 'body', left(a.body, 300), 'createdAt', a.created_at)
      from public.class_announcements a
      where v_classe is not null and v_classe = any (a.classes)
      order by a.created_at desc
      limit 1
    )
  );
end;
$$;

revoke all on function private.class_info_for(uuid) from public, anon, authenticated;

-- Vue « Ma classe » sur le site.
create or replace function public.class_info_mine()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select private.class_info_for((select auth.uid()));
$$;

-- Lecture par l'extension : le jeton remplace la session. Rien n'est écrit, aucune trace d'appel.
create or replace function public.extension_class_info(p_token text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select private.class_info_for((
    select t.user_id from public.extension_tokens t
    where char_length(coalesce(p_token, '')) between 40 and 100
      and t.token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
  ));
$$;

-- Nouveau jeton pour l'élève connecté (remplace l'ancien). Le jeton en clair n'est renvoyé qu'ici.
create or replace function public.extension_token_create()
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_token text;
begin
  if v_uid is null or not exists (select 1 from public.profiles p where p.id = v_uid and p.role = 'student') then
    return null;
  end if;
  v_token := 'tdc_' || encode(extensions.gen_random_bytes(32), 'hex');
  insert into public.extension_tokens (user_id, token_hash, created_at)
  values (v_uid, encode(extensions.digest(v_token, 'sha256'), 'hex'), now())
  on conflict (user_id) do update set token_hash = excluded.token_hash, created_at = excluded.created_at;
  return v_token;
end;
$$;

create or replace function public.extension_token_revoke()
returns void
language sql
volatile
security definer
set search_path = ''
as $$
  delete from public.extension_tokens where user_id = (select auth.uid());
$$;

-- Date de création du jeton actuel, ou null.
create or replace function public.extension_token_created_at()
returns timestamptz
language sql
stable
security definer
set search_path = ''
as $$
  select t.created_at from public.extension_tokens t where t.user_id = (select auth.uid());
$$;

revoke all on function public.class_info_mine() from public, anon;
revoke all on function public.extension_class_info(text) from public;
revoke all on function public.extension_token_create() from public, anon;
revoke all on function public.extension_token_revoke() from public, anon;
revoke all on function public.extension_token_created_at() from public, anon;
grant execute on function public.class_info_mine() to authenticated;
-- Appelée sans session par la route /api/extension/classe : le jeton suffit.
grant execute on function public.extension_class_info(text) to anon, authenticated;
grant execute on function public.extension_token_create() to authenticated;
grant execute on function public.extension_token_revoke() to authenticated;
grant execute on function public.extension_token_created_at() to authenticated;
