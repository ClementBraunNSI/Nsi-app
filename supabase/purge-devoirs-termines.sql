-- Ménage automatique des devoirs : chaque nuit, Supabase supprime les devoirs dont la date limite
-- est passée depuis plus de 7 jours, avec les validations des élèves qui s'y rattachent.
-- Un devoir sans date limite n'est jamais supprimé automatiquement.
--
-- Déjà appliqué sur le projet du site (migration « purge_devoirs_termines », 25/10/2026).
-- Pour un autre projet : Supabase → SQL Editor → coller tout ce fichier → Run.
-- Le relancer ne crée pas de doublon : la fonction et la tâche planifiée sont remplacées.

-- 1. Tâches planifiées (pg_cron, fourni par Supabase).
create extension if not exists pg_cron with schema pg_catalog;

-- 2. Le ménage lui-même. Renvoie le nombre de devoirs supprimés.
create or replace function public.purge_finished_homework()
returns integer
language plpgsql
set search_path = public
as $$
declare
  removed integer;
begin
  -- Les validations partent avec leur devoir (utile même si la clé étrangère n'est pas en « cascade »).
  delete from public.homework_completions
  where homework_id in (
    select id from public.homework
    where due_at is not null
      and due_at < now() - interval '7 days'
  );

  delete from public.homework
  where due_at is not null
    and due_at < now() - interval '7 days';

  get diagnostics removed = row_count;
  return removed;
end;
$$;

-- Fonction réservée à la tâche planifiée : ni les visiteurs ni les élèves ne peuvent l'appeler depuis le site.
revoke execute on function public.purge_finished_homework() from public, anon, authenticated;

-- 3. Tous les jours à 3 h UTC (4 h ou 5 h à Paris).
select cron.schedule(
  'purge-devoirs-termines',
  '0 3 * * *',
  $$select public.purge_finished_homework()$$
);

-- ---------------------------------------------------------------------------------------------
-- Requêtes utiles (à lancer séparément, au besoin) :
--
-- Voir ce qui partira à la prochaine exécution :
--   select id, title, classe, due_at from public.homework
--   where due_at is not null and due_at < now() - interval '7 days'
--   order by due_at;
--
-- Faire le ménage tout de suite, sans attendre la nuit :
--   select public.purge_finished_homework();
--
-- Vérifier que la tâche est bien programmée, puis voir ses dernières exécutions :
--   select jobname, schedule, active from cron.job;
--   select status, return_message, start_time from cron.job_run_details order by start_time desc limit 5;
--
-- Arrêter le ménage automatique :
--   select cron.unschedule('purge-devoirs-termines');
