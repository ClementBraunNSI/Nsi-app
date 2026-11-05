-- Visio de classe : lien vers une classe virtuelle de l'Éducation nationale, rejointe en invité par les élèves.
-- L'enseignant gère les visios par RLS ; l'élève ne reçoit l'adresse et le code que par private.class_info_for,
-- pour sa classe, et seulement quand la visio est ouverte ou qu'une séance commence dans moins de 15 minutes.

create table if not exists public.class_visios (
  id uuid primary key default gen_random_uuid(),
  classes text[] not null check (cardinality(classes) between 1 and 40),
  title text not null default '' check (char_length(title) <= 200),
  url text not null check (url ~ '^https://' and char_length(url) <= 1000),
  access_code text not null default '' check (char_length(access_code) <= 100),
  note text not null default '' check (char_length(note) <= 500),
  is_open boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists class_visios_classes_idx on public.class_visios using gin (classes);
create index if not exists class_visios_created_by_idx on public.class_visios (created_by);

-- Séances planifiées (heure de Paris), montrées avec les interros et les DS.
create table if not exists public.class_visio_sessions (
  id uuid primary key default gen_random_uuid(),
  visio_id uuid not null references public.class_visios (id) on delete cascade,
  day date not null,
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

create index if not exists class_visio_sessions_visio_idx on public.class_visio_sessions (visio_id, day);

alter table public.class_visios enable row level security;
alter table public.class_visio_sessions enable row level security;

drop policy if exists class_visios_elevated on public.class_visios;
create policy class_visios_elevated on public.class_visios for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

drop policy if exists class_visio_sessions_elevated on public.class_visio_sessions;
create policy class_visio_sessions_elevated on public.class_visio_sessions for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

-- Informations de la classe d'un élève, avec les visios (voir 20261106_infos_classe.sql).
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
    -- Adresse et code seulement quand la visio est rejoignable.
    'visios', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', v.id,
          'title', v.title,
          'note', v.note,
          'joinable', j.joinable,
          'url', case when j.joinable then v.url end,
          'code', case when j.joinable and v.access_code <> '' then v.access_code end,
          'nextSession', (
            select jsonb_build_object('day', s.day, 'start', to_char(s.start_time, 'HH24:MI'), 'end', to_char(s.end_time, 'HH24:MI'))
            from public.class_visio_sessions s
            where s.visio_id = v.id and ((s.day + s.end_time) at time zone 'Europe/Paris') > now()
            order by s.day, s.start_time
            limit 1
          )
        )
        order by v.created_at
      )
      from public.class_visios v
      cross join lateral (
        select v.is_open or exists (
          select 1 from public.class_visio_sessions s
          where s.visio_id = v.id
            and now() >= ((s.day + s.start_time) at time zone 'Europe/Paris') - interval '15 minutes'
            and now() < ((s.day + s.end_time) at time zone 'Europe/Paris')
        ) as joinable
      ) j
      where v_classe is not null and v_classe = any (v.classes)
    ), '[]'::jsonb),
    'visioSessions', coalesce((
      select jsonb_agg(item order by item ->> 'day', item ->> 'start')
      from (
        select jsonb_build_object(
          'id', s.id,
          'title', v.title,
          'day', s.day,
          'start', to_char(s.start_time, 'HH24:MI'),
          'end', to_char(s.end_time, 'HH24:MI')
        ) as item
        from public.class_visio_sessions s
        join public.class_visios v on v.id = s.visio_id
        where v_classe is not null and v_classe = any (v.classes)
          and ((s.day + s.end_time) at time zone 'Europe/Paris') > now()
        order by s.day, s.start_time
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
