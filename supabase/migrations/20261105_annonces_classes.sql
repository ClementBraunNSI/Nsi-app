-- Annonces par classe : canal à sens unique, seul l'enseignant écrit. Chaque classe qui a des élèves a le sien.
-- L'enseignant gère les annonces par RLS (compte admin ou enseignant) ; l'élève ne lit que celles de sa classe,
-- par des fonctions security definer, comme challenge_* et eval_*.

create table if not exists public.class_announcements (
  id uuid primary key default gen_random_uuid(),
  classes text[] not null check (cardinality(classes) between 1 and 40),
  body text not null check (char_length(body) between 1 and 5000),
  pinned boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists class_announcements_classes_idx on public.class_announcements using gin (classes);
create index if not exists class_announcements_created_idx on public.class_announcements (created_at desc);
create index if not exists class_announcements_created_by_idx on public.class_announcements (created_by);

-- Dernière lecture des annonces par élève : sert à la pastille « non lu ».
create table if not exists public.class_announcement_reads (
  user_id uuid primary key references auth.users (id) on delete cascade,
  last_read_at timestamptz not null default now()
);

alter table public.class_announcements enable row level security;
alter table public.class_announcement_reads enable row level security;

drop policy if exists class_announcements_elevated on public.class_announcements;
create policy class_announcements_elevated on public.class_announcements for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

drop policy if exists class_announcement_reads_elevated on public.class_announcement_reads;
create policy class_announcement_reads_elevated on public.class_announcement_reads for all to authenticated
  using ((select private.is_elevated())) with check ((select private.is_elevated()));

-- Annonces de la classe de l'élève : épinglées d'abord, puis de la plus récente à la plus ancienne.
-- lastReadAt est la lecture précédente, pour marquer les nouvelles.
create or replace function public.announcement_list_mine()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_classe text;
  v_read timestamptz;
begin
  if v_uid is null then
    return jsonb_build_object('classe', null, 'lastReadAt', null, 'items', '[]'::jsonb);
  end if;
  select p.classe into v_classe from public.profiles p where p.id = v_uid and p.role = 'student';
  if v_classe is null then
    return jsonb_build_object('classe', null, 'lastReadAt', null, 'items', '[]'::jsonb);
  end if;
  select r.last_read_at into v_read from public.class_announcement_reads r where r.user_id = v_uid;

  return jsonb_build_object(
    'classe', v_classe,
    'lastReadAt', v_read,
    'items', coalesce((
      select jsonb_agg(item order by (item ->> 'pinned')::boolean desc, item ->> 'createdAt' desc)
      from (
        select jsonb_build_object(
          'id', a.id,
          'body', a.body,
          'pinned', a.pinned,
          'createdAt', a.created_at,
          'author', author.full_name
        ) as item
        from public.class_announcements a
        left join public.profiles author on author.id = a.created_by
        where v_classe = any (a.classes)
        order by a.pinned desc, a.created_at desc
        limit 100
      ) listed
    ), '[]'::jsonb)
  );
end;
$$;

-- L'élève a ouvert la page des annonces.
create or replace function public.announcement_mark_read()
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null or not exists (
    select 1 from public.profiles p where p.id = v_uid and p.role = 'student' and p.classe is not null
  ) then
    return;
  end if;
  insert into public.class_announcement_reads (user_id, last_read_at)
  values (v_uid, now())
  on conflict (user_id) do update set last_read_at = excluded.last_read_at;
end;
$$;

-- Annonces de la classe publiées depuis la dernière lecture : pastille de la barre du site.
create or replace function public.announcement_unread_count()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.class_announcements a
  join public.profiles p on p.id = (select auth.uid())
  left join public.class_announcement_reads r on r.user_id = p.id
  where p.role = 'student'
    and p.classe is not null
    and p.classe = any (a.classes)
    and (r.last_read_at is null or a.created_at > r.last_read_at);
$$;

revoke all on function public.announcement_list_mine() from public, anon;
revoke all on function public.announcement_mark_read() from public, anon;
revoke all on function public.announcement_unread_count() from public, anon;
grant execute on function public.announcement_list_mine() to authenticated;
grant execute on function public.announcement_mark_read() to authenticated;
grant execute on function public.announcement_unread_count() to authenticated;
