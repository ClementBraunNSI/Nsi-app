-- Chasse aux Ren'Arts : depuis l'accueil, les élèves envoient le tableau généré par IA avec leur prénom et leur classe,
-- pour que l'enseignant en garde une copie. L'envoi passe par chasse_renart_create, ouverte même sans connexion :
-- elle vérifie la classe (la liste n'est écrite qu'ici, jamais sur le site) et limite le nombre d'envois.
-- L'enseignant (compte admin ou enseignant) lit et supprime tout.

create table if not exists public.chasse_renarts (
  id uuid primary key default gen_random_uuid(),
  prenom text not null check (char_length(prenom) between 1 and 40),
  classe text not null check (char_length(classe) between 1 and 12),
  -- Tableau réencodé en JPEG dans le navigateur, en data URL (comme les captures des bugs).
  image text not null check (image like 'data:image/jpeg;base64,%' and char_length(image) <= 2600000),
  -- Vignette, pour lister les envois sans charger les tableaux.
  thumbnail text not null check (thumbnail like 'data:image/jpeg;base64,%' and char_length(thumbnail) <= 120000),
  -- Pour plafonner la place prise en base sans relire les images.
  image_size integer generated always as (octet_length(image)) stored,
  -- Compte de l'élève s'il était connecté au moment de l'envoi.
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists chasse_renarts_created_idx on public.chasse_renarts (created_at desc);
create index if not exists chasse_renarts_user_idx on public.chasse_renarts (user_id);

alter table public.chasse_renarts enable row level security;

drop policy if exists chasse_renarts_teacher_select on public.chasse_renarts;
create policy chasse_renarts_teacher_select on public.chasse_renarts for select to authenticated
  using ((select private.is_elevated()));

drop policy if exists chasse_renarts_teacher_delete on public.chasse_renarts;
create policy chasse_renarts_teacher_delete on public.chasse_renarts for delete to authenticated
  using ((select private.is_elevated()));

-- Envoi d'un tableau, connecté ou non ; renvoie l'identifiant de l'envoi.
create or replace function public.chasse_renart_create(p_prenom text, p_classe text, p_image text, p_thumbnail text)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_prenom text := left(regexp_replace(btrim(coalesce(p_prenom, '')), '\s+', ' ', 'g'), 40);
  -- « 2gt04 », « 2 GT 04 », « 2GT-04 » ou « 2GT4 » valent « 2GT04 ».
  v_classe text := regexp_replace(upper(regexp_replace(coalesce(p_classe, ''), '[\s._-]', '', 'g')), '^2GT([0-9])$', '2GT0\1');
  v_id uuid;
begin
  if v_prenom = '' then
    raise exception 'Indique ton prénom.';
  end if;
  if v_classe = '' then
    raise exception 'Indique ta classe.';
  end if;
  if v_classe not in ('2GT04', '2GT06', '2GT08') then
    raise exception 'Classe inconnue : écris-la comme sur ton emploi du temps.';
  end if;
  if p_image is null or p_image not like 'data:image/jpeg;base64,%' or char_length(p_image) > 2600000
     or p_thumbnail is null or p_thumbnail not like 'data:image/jpeg;base64,%' or char_length(p_thumbnail) > 120000 then
    raise exception 'Le tableau n''a pas pu être lu : réessaie avec une image PNG ou JPEG.';
  end if;
  if (select count(*) from public.chasse_renarts r
      where r.classe = v_classe and lower(r.prenom) = lower(v_prenom) and r.created_at > now() - interval '1 day') >= 5 then
    raise exception 'Déjà 5 tableaux envoyés aujourd''hui avec ce prénom : réessaie demain.';
  end if;
  if (select count(*) from public.chasse_renarts r where r.created_at > now() - interval '1 hour') >= 120 then
    raise exception 'Beaucoup d''envois en ce moment : réessaie dans une heure.';
  end if;
  -- Garde-fou contre le remplissage de la base : environ 300 Mo de tableaux au plus.
  if (select coalesce(sum(r.image_size), 0) from public.chasse_renarts r) > 300000000 then
    raise exception 'La réception des tableaux est pleine : préviens ton professeur.';
  end if;

  insert into public.chasse_renarts (prenom, classe, image, thumbnail, user_id)
  values (v_prenom, v_classe, p_image, p_thumbnail, (select auth.uid()))
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.chasse_renart_create(text, text, text, text) from public;
grant execute on function public.chasse_renart_create(text, text, text, text) to anon, authenticated;
