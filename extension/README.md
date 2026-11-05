# Extension « La tanière du code »

Extension de navigateur (Manifest V3) pour les élèves : devoirs à faire, dates d'interros et de DS, visio et annonces de la classe. Elle fonctionne sur Chrome, Edge et Firefox (121 ou plus récent).

- **Popup** : la visio (bouton « Rejoindre la visio » quand elle est ouverte, sinon la prochaine séance), la dernière annonce non lue, les prochaines interros et DS, les devoirs pas encore faits.
- **Badge** sur l'icône : nombre d'annonces non lues (« ! » quand le jeton est refusé).
- **Notifications** système :
  - à chaque nouvelle annonce, une seule fois par annonce. Un clic ouvre la page Ma classe ;
  - quand une visio s'ouvre, que l'enseignant l'ait ouverte ou qu'une séance planifiée commence dans moins de 15 minutes. Un clic ouvre la classe virtuelle.
- **Vérification** toutes les 5 minutes (`chrome.alarms`), au démarrage du navigateur, et par le bouton « Actualiser ». La notification de visio arrive donc jusqu'à 5 minutes après l'ouverture.

Une annonce compte comme lue quand l'élève ouvre la page **Ma classe** du site. L'extension ne fait que lire.

## Identification

L'élève crée un **jeton personnel** sur le site (espace élève, page Ma classe, rubrique « Extension de navigateur »), puis le colle dans les réglages de l'extension.

- Le site ne garde que l'empreinte sha256 du jeton (table `extension_tokens`). Le jeton en clair n'est affiché qu'une fois.
- Un nouveau jeton remplace l'ancien. « Révoquer » le supprime.
- Le jeton ne donne accès qu'aux informations de la classe de l'élève, en lecture seule. L'adresse et le code de la visio ne sont envoyés que quand elle est rejoignable. L'extension passe par la route `GET /api/extension/classe` (en-tête `Authorization: Bearer tdc_…`) et la fonction `extension_class_info`.

## Confidentialité

Aucun traceur, aucune statistique, aucun cookie : la requête part avec `credentials: "omit"`. Seuls sont gardés dans `chrome.storage.local` le jeton, le site choisi, la dernière réponse, l'identifiant de la dernière annonce notifiée et ceux des visios déjà signalées. Pas d'autorisation d'accès aux sites : la route du site répond aux requêtes de l'extension (CORS). Les autorisations demandées sont `storage`, `alarms` et `notifications`.

## Tester

1. Démarrer le site en local (`npm run dev`, port 3000), ou utiliser le site en ligne.
2. Se connecter avec un compte élève qui a une classe, ouvrir **Ma classe** et créer un jeton.
3. Charger l'extension :
   - **Chrome / Edge** : `chrome://extensions` (ou `edge://extensions`), activer le mode développeur, « Charger l'extension non empaquetée », puis choisir le dossier `extension/`.
   - **Firefox** : `about:debugging#/runtime/this-firefox`, « Charger un module complémentaire temporaire », puis choisir `extension/manifest.json`.
4. Ouvrir les réglages de l'extension, coller le jeton, choisir `http://localhost:3000` pour le site local, puis « Enregistrer et vérifier ».
5. Publier une annonce pour la classe depuis `/admin/annonces`, puis cliquer sur « Actualiser » dans le popup. Le badge et la notification doivent apparaître.
6. Dans `/admin/devoirs`, section Visio, passer une visio de la classe à « Ouverte », puis cliquer sur « Actualiser ». Le bouton « Rejoindre la visio » et la notification doivent apparaître.

Pour suivre les appels, inspecter le service worker (Chrome : lien « service worker » sur la carte de l'extension ; Firefox : « Examiner »).

## Publier

Avant chaque publication, augmenter `version` dans `manifest.json`, puis créer l'archive depuis le dossier `extension/`. Le manifeste doit être à la racine de l'archive :

```bash
cd extension && zip -r ../taniere-du-code-extension.zip . -x README.md
```

- **Chrome Web Store** : compte développeur (5 $ US, payés une seule fois) sur https://chrome.google.com/webstore/devconsole. Envoyer l'archive, remplir la fiche (captures d'écran 1280×800, icône 128 px déjà fournie) et l'onglet « Confidentialité » (aucune donnée collectée ; justifier `storage`, `alarms` et `notifications`). La visibilité « Non répertoriée » suffit : seuls les élèves qui ont le lien l'installent.
- **Microsoft Edge Add-ons** : gratuit, sur https://partner.microsoft.com/dashboard/microsoftedge. Même archive.
- **Firefox (addons.mozilla.org)** : gratuit, sur https://addons.mozilla.org/developers/. Même archive. L'identifiant `taniere-du-code@clementbraun.info` et `data_collection_permissions` (aucune donnée) sont déjà dans le manifeste. Choisir « Sur ce site » pour une fiche publique ou « Par vous-même » pour un fichier signé à distribuer.

Les postes du lycée peuvent bloquer l'installation d'extensions : se renseigner auprès de l'administrateur du réseau. Il n'existe pas d'extension pour les navigateurs mobiles : sur téléphone, la page Ma classe du site joue le même rôle.
