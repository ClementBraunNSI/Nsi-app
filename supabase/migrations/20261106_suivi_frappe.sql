-- Suivi de frappe des exercices : résumé calculé par le serveur à chaque vérification (collages, blocs apparus
-- d'un coup, vitesse, corrections, sorties de la page), et l'historique complet de la saisie pour un essai réussi.
-- Écrit par le serveur seulement (clé de service), lu comme le reste de la ligne : l'élève ses essais, l'enseignant tout.

alter table public.exercise_submissions
  add column if not exists typing jsonb
  check (typing is null or pg_column_size(typing) <= 300000);
