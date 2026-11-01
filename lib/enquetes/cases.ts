import { ANIMAUX } from "./animaux";
import type { Enquete, Table } from "./types";

const rapports = (rows: Table["rows"]): Table => ({
  name: "rapports",
  description: "Les incidents signalés au poste de garde de la forêt.",
  columns: [
    { name: "id", type: "INTEGER", description: "Numéro du rapport" },
    { name: "date", type: "TEXT", description: "Date de l'incident (AAAA-MM-JJ)" },
    { name: "lieu", type: "TEXT", description: "Lieu de l'incident" },
    { name: "description", type: "TEXT", description: "Ce qui s'est passé" },
  ],
  rows,
});

const temoignages = (rows: Table["rows"]): Table => ({
  name: "temoignages",
  description: "Ce que les témoins ont raconté, rapport par rapport.",
  columns: [
    { name: "id", type: "INTEGER", description: "Numéro du témoignage" },
    { name: "rapport_id", type: "INTEGER", description: "Rapport concerné (rapports.id)" },
    { name: "temoin", type: "TEXT", description: "Nom du témoin" },
    { name: "texte", type: "TEXT", description: "Ce que le témoin a dit" },
  ],
  rows,
});

const passages = (rows: Table["rows"]): Table => ({
  name: "passages",
  description: "Les passages repérés par les pièges photo de la forêt.",
  columns: [
    { name: "id", type: "INTEGER", description: "Numéro du passage" },
    { name: "animal_id", type: "INTEGER", description: "Animal photographié (animaux.id)" },
    { name: "lieu", type: "TEXT", description: "Lieu du piège photo" },
    { name: "date", type: "TEXT", description: "Date (AAAA-MM-JJ)" },
    { name: "heure", type: "TEXT", description: "Heure (HH:MM)" },
  ],
  rows,
});

/** Enquête 1 : une seule table à filtrer, plusieurs conditions. */
const OEUFS: Enquete = {
  slug: "oeufs-croques",
  numero: 1,
  title: "Qui a croqué les œufs ?",
  difficulty: "Facile",
  skills: ["Lire une table", "Filtrer avec plusieurs conditions"],
  pitch: "Douze œufs ont disparu du poulailler. Toute la forêt accuse Roux le renard. À tort ?",
  story: [
    "Au matin du 13 octobre 2026, la fermière des Tilleuls découvre son poulailler sens dessus dessous : douze œufs ont disparu pendant la nuit.",
    "Toute la forêt montre Roux le renard du doigt. Lui jure qu'il est innocent. Le garde forestier te confie le dossier : retrouve le vrai coupable grâce aux registres de la forêt.",
  ],
  objective: "Trouve le nom de l'animal qui a volé les œufs.",
  tables: [
    rapports([
      [1, "2026-10-10", "Mare aux Iris", "Un nénuphar a été arraché. Rien de grave."],
      [2, "2026-10-11", "Clairière", "Des champignons ont été piétinés près du grand rocher."],
      [3, "2026-10-12", "Poulailler des Tilleuls", "Douze œufs ont disparu entre 22 h et minuit. Deux témoins ont été entendus : Hulotte et Piquet."],
      [4, "2026-10-13", "Grand Chêne", "Des bruits étranges ont été entendus dans la nuit, sans suite."],
    ]),
    temoignages([
      [1, 1, "Crôa", "Quelqu'un a sauté dans la mare. Plouf, et puis plus rien."],
      [2, 2, "Biscotte", "Ce sont les sangliers, comme toujours."],
      [3, 3, "Hulotte", "J'étais perchée au-dessus du poulailler. Une silhouette fine et allongée, entre 15 et 35 cm, s'est glissée sous la clôture. Pelage brun sur le dos, blanc sur le ventre."],
      [4, 3, "Piquet", "Je passais par la haie. L'animal est reparti en courant vers le Vieux Moulin, là où il a son terrier."],
      [5, 3, "Roux", "Ce n'est pas moi ! Cette nuit-là, je pêchais au ruisseau. Demandez à Ondine la loutre."],
      [6, 4, "Gaspard", "Croa. Je dormais."],
    ]),
    passages([
      [1, 1, "Ruisseau", "2026-10-12", "22:30"],
      [2, 11, "Ruisseau", "2026-10-12", "22:45"],
      [3, 1, "Ruisseau", "2026-10-12", "23:40"],
      [4, 2, "Poulailler des Tilleuls", "2026-10-12", "23:10"],
      [5, 2, "Vieux Moulin", "2026-10-13", "00:15"],
      [6, 20, "Vieux Moulin", "2026-10-12", "21:00"],
      [7, 6, "Clairière", "2026-10-12", "23:00"],
      [8, 17, "Combe aux Pierres", "2026-10-12", "23:30"],
      [9, 3, "Clairière", "2026-10-12", "22:10"],
    ]),
    ANIMAUX,
  ],
  culprit: "Zélie",
  hints: [
    "Commence par la table rapports : quel rapport parle du poulailler ? Note son numéro.",
    "Lis les témoignages de ce rapport (rapport_id). Ils décrivent le pelage, la taille et le terrier du coupable.",
    "Dans animaux, garde ceux dont le pelage vaut « brun et blanc », qui vivent au « Vieux Moulin » et qui mesurent entre 15 et 35 cm.",
  ],
  explanation:
    "Les témoins décrivent un animal brun et blanc, fin, entre 15 et 35 cm, qui vit au Vieux Moulin. Trois conditions dans la table animaux ne laissent qu'un nom : Zélie la belette. Le piège photo du poulailler l'a d'ailleurs vue à 23 h 10, pendant que Roux pêchait au ruisseau.",
  solutionSql: [
    "SELECT * FROM rapports WHERE lieu LIKE '%Poulailler%'",
    "SELECT * FROM temoignages WHERE rapport_id = 3",
    "SELECT nom FROM animaux WHERE pelage = 'brun et blanc' AND terrier = 'Vieux Moulin' AND taille_cm BETWEEN 15 AND 35",
  ],
};

/** Enquête 2 : croiser plusieurs tables et vérifier des alibis. */
const MIEL: Enquete = {
  slug: "miel-envole",
  numero: 2,
  title: "Le miel envolé",
  difficulty: "Moyen",
  skills: ["Croiser deux tables", "Comparer des dates et des heures"],
  pitch: "Les ruches de la clairière ont été pillées en plein après-midi. Le voleur a laissé une empreinte, et chaque suspect a un alibi qu'il faudra vérifier.",
  story: [
    "Le 19 octobre 2026, les abeilles de la clairière sont furieuses : trois rayons de miel ont disparu de leurs ruches.",
    "Le voleur a laissé une empreinte bien nette dans la boue. Il ne reste plus qu'à savoir à qui elle appartient, et qui n'était pas ailleurs à ce moment-là.",
  ],
  objective: "Trouve le nom de l'animal qui a volé le miel.",
  tables: [
    rapports([
      [5, "2026-10-18", "Sentier des Fougères", "Un panneau indicateur a été renversé."],
      [6, "2026-10-19", "Ruches de la Clairière", "Trois rayons de miel ont été volés entre 14 h et 16 h. La ruche n°2 porte des traces de griffes. Une empreinte nette mesure 9 cm."],
      [7, "2026-10-20", "Mare aux Iris", "La barque des grenouilles a dérivé jusqu'aux roseaux."],
    ]),
    {
      name: "empreintes",
      description: "Le guide des empreintes : la longueur typique d'une empreinte selon l'espèce.",
      columns: [
        { name: "espece", type: "TEXT", description: "Espèce" },
        { name: "longueur_cm", type: "INTEGER", description: "Longueur de l'empreinte en cm" },
        { name: "remarque", type: "TEXT", description: "Détail pour la reconnaître" },
      ],
      rows: [
        ["renard", 5, "Quatre doigts, forme ovale"],
        ["lapin", 4, "Pattes arrière très allongées"],
        ["blaireau", 9, "Cinq doigts, longues griffes"],
        ["sanglier", 7, "Deux sabots"],
        ["raton laveur", 8, "Comme une petite main"],
        ["écureuil", 3, "Quatre doigts fins"],
        ["biche", 6, "Deux sabots pointus"],
        ["hérisson", 3, "Cinq doigts minuscules"],
        ["loutre", 7, "Doigts palmés"],
      ],
    },
    {
      name: "alibis",
      description: "Ce que chacun déclare avoir fait, avec un témoin pour le confirmer.",
      columns: [
        { name: "id", type: "INTEGER", description: "Numéro de l'alibi" },
        { name: "animal_id", type: "INTEGER", description: "Animal concerné (animaux.id)" },
        { name: "date", type: "TEXT", description: "Date (AAAA-MM-JJ)" },
        { name: "debut", type: "TEXT", description: "Heure de début (HH:MM)" },
        { name: "fin", type: "TEXT", description: "Heure de fin (HH:MM)" },
        { name: "activite", type: "TEXT", description: "Ce qu'il faisait" },
        { name: "temoin", type: "TEXT", description: "Qui peut le confirmer" },
      ],
      rows: [
        [1, 7, "2026-10-19", "13:30", "17:00", "Partie de cartes au Grand Chêne", "Hulotte"],
        [2, 9, "2026-10-19", "14:00", "16:30", "Marché de la Mare", "Crôa"],
        [3, 8, "2026-10-18", "10:00", "12:00", "Sieste à la Combe aux Pierres", "Hermès"],
        [4, 8, "2026-10-19", "09:00", "11:00", "Ménage du terrier", "personne"],
        [5, 13, "2026-10-19", "14:00", "16:00", "Pêche au ruisseau", "Ondine"],
        [6, 10, "2026-10-19", "13:00", "15:00", "Cueillette de noisettes", "Plume"],
      ],
    },
    ANIMAUX,
  ],
  culprit: "Bourru",
  hints: [
    "Le rapport sur les ruches donne la longueur de l'empreinte. Cherche cette longueur dans la table empreintes : quelle espèce ?",
    "Liste les animaux de cette espèce. Note leurs numéros (id).",
    "Regarde les alibis du 19 octobre de ces animaux : qui n'a aucun alibi entre 14 h et 16 h ?",
  ],
  explanation:
    "Une empreinte de 9 cm correspond à un blaireau. Trois blaireaux vivent dans la forêt : Grisou, Moka et Bourru. Grisou jouait aux cartes et Moka faisait le marché pendant le vol. Bourru, lui, n'a d'alibi que le matin : c'est lui, le voleur de miel.",
  solutionSql: [
    "SELECT * FROM empreintes WHERE longueur_cm = 9",
    "SELECT animaux.nom, alibis.debut, alibis.fin FROM animaux LEFT JOIN alibis ON alibis.animal_id = animaux.id AND alibis.date = '2026-10-19' WHERE animaux.espece = 'blaireau'",
    "SELECT nom FROM animaux WHERE espece = 'blaireau' AND id NOT IN (SELECT animal_id FROM alibis WHERE date = '2026-10-19' AND debut <= '14:00' AND fin >= '16:00')",
  ],
};

/** Enquête 3 : jointures, regroupement et comptage. */
const BARRAGE: Enquete = {
  slug: "barrage-perce",
  numero: 3,
  title: "Le barrage percé",
  difficulty: "Difficile",
  skills: ["Relier plusieurs tables", "Compter et regrouper"],
  pitch: "Le barrage des castors a été saboté en pleine nuit. Le coupable a laissé une corde, et beaucoup d'indices dans les registres.",
  story: [
    "Dans la nuit du 26 octobre 2026, un trou a été percé à la base du barrage des castors. Bâtisseur et sa famille ont passé la nuit à colmater.",
    "Le saboteur a laissé une corde coupée sur l'eau. Trois indices le désignent : la corde, le club dont il fait partie et ses visites répétées au barrage.",
  ],
  objective: "Trouve le nom de l'animal qui a saboté le barrage.",
  tables: [
    rapports([
      [8, "2026-10-25", "Comptoir du Ruisseau", "Inventaire : le stock de corde est presque épuisé."],
      [9, "2026-10-26", "Barrage des Castors", "Le barrage a été percé pendant la nuit. Une corde coupée flottait sur l'eau."],
    ]),
    temoignages([
      [7, 9, "Bâtisseur", "Le coupable a dû plonger pour atteindre la base du barrage. Il fait partie du Club des Nageurs, j'en mettrais ma queue à couper."],
      [8, 9, "Gaspard", "Je l'ai vu traîner près du barrage plusieurs fois ce mois-ci. Au moins trois fois, croa."],
      [9, 9, "Ondine", "La corde vient du Comptoir du Ruisseau. Ils en ont vendu la veille, le 25."],
    ]),
    {
      name: "achats",
      description: "Les ventes du Comptoir du Ruisseau.",
      columns: [
        { name: "id", type: "INTEGER", description: "Numéro de la vente" },
        { name: "animal_id", type: "INTEGER", description: "Acheteur (animaux.id)" },
        { name: "date", type: "TEXT", description: "Date (AAAA-MM-JJ)" },
        { name: "article", type: "TEXT", description: "Ce qui a été acheté" },
        { name: "quantite", type: "INTEGER", description: "Quantité" },
      ],
      rows: [
        [1, 11, "2026-10-25", "corde", 1],
        [2, 12, "2026-10-25", "corde", 2],
        [3, 13, "2026-10-25", "corde", 1],
        [4, 10, "2026-10-25", "glands", 30],
        [5, 12, "2026-10-20", "bougie", 1],
        [6, 14, "2026-10-24", "clous", 50],
        [7, 18, "2026-10-24", "corde", 1],
      ],
    },
    {
      name: "clubs",
      description: "Les clubs de la forêt et leurs membres.",
      columns: [
        { name: "animal_id", type: "INTEGER", description: "Membre (animaux.id)" },
        { name: "club", type: "TEXT", description: "Nom du club" },
      ],
      rows: [
        [11, "Club des Nageurs"],
        [12, "Club des Nageurs"],
        [14, "Club des Nageurs"],
        [15, "Club des Nageurs"],
        [13, "Club des Grimpeurs"],
        [10, "Club des Grimpeurs"],
        [4, "Club des Veilleurs"],
        [21, "Club des Veilleurs"],
        [18, "Club des Gourmands"],
      ],
    },
    passages([
      [10, 12, "Barrage des Castors", "2026-10-03", "21:10"],
      [11, 12, "Barrage des Castors", "2026-10-11", "22:40"],
      [12, 12, "Barrage des Castors", "2026-10-19", "23:05"],
      [13, 12, "Barrage des Castors", "2026-10-24", "22:15"],
      [14, 11, "Barrage des Castors", "2026-10-15", "18:30"],
      [15, 13, "Barrage des Castors", "2026-10-08", "20:00"],
      [16, 13, "Barrage des Castors", "2026-10-22", "21:45"],
      [17, 15, "Barrage des Castors", "2026-10-05", "19:20"],
      [18, 15, "Barrage des Castors", "2026-10-12", "19:40"],
      [19, 15, "Barrage des Castors", "2026-10-20", "20:05"],
      [20, 14, "Barrage des Castors", "2026-10-02", "08:00"],
      [21, 14, "Barrage des Castors", "2026-10-09", "08:10"],
      [22, 14, "Barrage des Castors", "2026-10-16", "08:05"],
      [23, 14, "Barrage des Castors", "2026-10-23", "08:00"],
      [24, 18, "Bois Profond", "2026-10-26", "01:30"],
    ]),
    ANIMAUX,
  ],
  culprit: "Ziggy",
  hints: [
    "Qui a acheté de la corde le 25 octobre ? Relie achats et animaux grâce à animal_id.",
    "Parmi eux, qui fait partie du Club des Nageurs ? La table clubs te le dira.",
    "Compte les passages de chacun au Barrage des Castors en octobre : il en faut au moins trois.",
  ],
  explanation:
    "Trois animaux ont acheté de la corde le 25 : Ondine, Ziggy et Filou. Filou n'est pas nageur. Entre Ondine et Ziggy, seul Ziggy le rat musqué est passé au moins trois fois au barrage ce mois-ci (quatre fois !). Le saboteur, c'est lui.",
  solutionSql: [
    "SELECT animaux.nom FROM achats JOIN animaux ON animaux.id = achats.animal_id WHERE achats.article = 'corde' AND achats.date = '2026-10-25'",
    "SELECT animaux.nom FROM achats JOIN animaux ON animaux.id = achats.animal_id JOIN clubs ON clubs.animal_id = animaux.id WHERE achats.article = 'corde' AND achats.date = '2026-10-25' AND clubs.club = 'Club des Nageurs' AND animaux.id IN (SELECT animal_id FROM passages WHERE lieu = 'Barrage des Castors' GROUP BY animal_id HAVING COUNT(*) >= 3)",
  ],
};

/** Pièges photo du soir de la fête, puis de tout l'après-midi (dépouillés à l'étape 2). */
const PASSAGES_SOIR: Table["rows"] = [
  [40, 19, "Grand Chêne", "2026-10-31", "19:30"],
  [41, 10, "Grand Chêne", "2026-10-31", "20:10"],
  [42, 18, "Grand Chêne", "2026-10-31", "20:20"],
  [43, 1, "Grand Chêne", "2026-10-31", "20:30"],
  [44, 13, "Grand Chêne", "2026-10-31", "20:35"],
  [45, 10, "Grand Chêne", "2026-10-31", "20:40"],
  [46, 16, "Grand Chêne", "2026-10-31", "20:50"],
  [47, 22, "Clairière", "2026-10-31", "20:30"],
  [48, 22, "Grand Chêne", "2026-10-31", "21:20"],
  [49, 23, "Clairière", "2026-10-31", "20:15"],
  [50, 1, "Terrier des Ronces", "2026-10-31", "21:40"],
  [51, 13, "Vieux Moulin", "2026-10-31", "21:05"],
];

const PASSAGES_APRES_MIDI: Table["rows"] = [
  [30, 22, "Relais des Ronces", "2026-10-31", "10:02"],
  [31, 9, "Relais du Vieux Moulin", "2026-10-31", "14:28"],
  [32, 20, "Relais du Vieux Moulin", "2026-10-31", "16:35"],
  [33, 13, "Relais du Vieux Moulin", "2026-10-31", "16:38"],
  [34, 2, "Vieux Moulin", "2026-10-31", "16:40"],
  [35, 6, "Relais du Vieux Moulin", "2026-10-31", "16:45"],
  [36, 16, "Relais de la Clairière", "2026-10-31", "16:52"],
  [37, 1, "Terrier des Ronces", "2026-10-31", "17:10"],
  [38, 20, "Relais du Vieux Moulin", "2026-10-31", "17:30"],
];

/** Enquête 4 : une longue affaire en quatre étapes. Chaque coupable trouvé relance l'enquête. */
const GLAND: Enquete = {
  slug: "gland-d-or",
  numero: 4,
  title: "L'affaire du Gland d'Or",
  difficulty: "Difficile",
  skills: ["Une enquête en quatre étapes", "Valeurs manquantes (NULL)", "Repérer un changement dans le temps", "Regrouper et additionner"],
  pitch: "Le trophée de la forêt a disparu pendant la Nuit des Lanternes. Un coupable est vite désigné. Un peu trop vite ?",
  stageTitle: "Le vol de la Nuit des Lanternes",
  story: [
    "Le 31 octobre 2026, toute la forêt fête la Nuit des Lanternes au pied du Grand Chêne. À 21 h, au moment de la remise des prix, la vitrine est vide : le Gland d'Or, trophée de la forêt depuis cent ans, a disparu.",
    "À 20 h, il était encore à sa place. Le garde forestier a rassemblé les rapports, les témoignages et les photos des pièges de la soirée.",
  ],
  objective: "Trouver le nom de l'animal qui a volé le Gland d'Or.",
  tables: [
    rapports([
      [10, "2026-10-30", "Grand Chêne", "Les lanternes de la fête sont accrochées. Le Gland d'Or est exposé dans sa vitrine."],
      [11, "2026-10-31", "Grand Chêne", "Le Gland d'Or a disparu de sa vitrine entre 20 h et 21 h, pendant la Nuit des Lanternes. Trois témoins ont été entendus."],
      [12, "2026-10-31", "Mare aux Iris", "Une lanterne est tombée à l'eau. Aucun blessé."],
    ]),
    temoignages([
      [10, 11, "Gaspard", "Je surveillais la fête depuis ma branche. Vers 20 h 30, un grand animal au pelage roux s'est glissé derrière la vitrine. Plus de 50 cm, croa, j'en suis sûr."],
      [11, 11, "Noisette", "J'habite dans le Grand Chêne. J'ai fait plusieurs allers-retours pour aller chercher des lanternes."],
      [12, 11, "Cerise", "Je tenais le stand de tisane, loin de la vitrine. Je n'ai rien vu."],
      [13, 12, "Crôa", "Plouf. C'était la lanterne verte."],
    ]),
    passages(PASSAGES_SOIR),
    ANIMAUX,
  ],
  culprit: "Roux",
  hints: [
    "Le rapport du 31 octobre au Grand Chêne donne l'heure du vol, et ses témoignages (rapport_id) décrivent le voleur.",
    "Dans passages, garder les photos prises au « Grand Chêne » le 2026-10-31 entre 20:00 et 21:00, puis relier chaque passage à son animal (animal_id).",
    "Parmi ces animaux, un seul a un pelage roux et mesure plus de 50 cm.",
  ],
  explanation:
    "D'après Gaspard, le voleur est un grand animal roux de plus de 50 cm. Entre 20 h et 21 h, un seul animal photographié au Grand Chêne correspond : Roux le renard, à 20 h 30. Noisette est rousse, mais elle ne mesure que 23 cm.",
  twist:
    "Roux ne nie pas être venu au Grand Chêne : il avait rendez-vous. Un message glissé sous sa porte dans l'après-midi lui demandait d'être derrière la vitrine à 20 h 30. Ce message n'est pas signé, et le Gland d'Or reste introuvable dans son terrier. Et si quelqu'un avait voulu que Roux soit vu près de la vitrine ?",
  solutionSql: [
    "SELECT * FROM temoignages WHERE rapport_id = 11",
    "SELECT DISTINCT animaux.nom FROM passages JOIN animaux ON animaux.id = passages.animal_id WHERE passages.lieu = 'Grand Chêne' AND passages.date = '2026-10-31' AND passages.heure BETWEEN '20:00' AND '21:00' AND animaux.pelage LIKE '%roux%' AND animaux.taille_cm > 50",
  ],
  next: [
    {
      title: "Le message sans signature",
      story: [
        "Roux montre le message reçu le 31 octobre : « Rendez-vous derrière la vitrine du Grand Chêne à 20 h 30. Un ami. » Aucun nom, mais le courrier de la forêt garde une trace de chaque lettre déposée à un relais.",
        "Les photos des pièges de tout l'après-midi du 31 ont été dépouillées, et le Comptoir du Ruisseau a transmis son registre des ventes.",
      ],
      objective: "Trouver le nom de l'animal qui a écrit le message sans signature.",
      tables: [
        {
          name: "courrier",
          description: "Les lettres déposées aux relais du courrier de la forêt.",
          columns: [
            { name: "id", type: "INTEGER", description: "Numéro de la lettre" },
            { name: "expediteur_id", type: "INTEGER", description: "Qui l'a signée (animaux.id), vide si elle n'est pas signée" },
            { name: "destinataire_id", type: "INTEGER", description: "À qui elle est adressée (animaux.id)" },
            { name: "date", type: "TEXT", description: "Date du dépôt (AAAA-MM-JJ)" },
            { name: "heure", type: "TEXT", description: "Heure du dépôt (HH:MM)" },
            { name: "relais", type: "TEXT", description: "Relais où la lettre a été déposée" },
            { name: "papier", type: "TEXT", description: "Sur quoi elle est écrite" },
          ],
          rows: [
            [1, 4, 16, "2026-10-29", "09:10", "Relais du Grand Chêne", "papier de lin"],
            [2, 3, 23, "2026-10-30", "11:00", "Relais de la Clairière", "feuille de chêne"],
            [3, null, 14, "2026-10-30", "15:20", "Relais du Ruisseau", "feuille de chêne"],
            [4, 22, 1, "2026-10-31", "10:05", "Relais des Ronces", "papier de lin"],
            [5, 9, 7, "2026-10-31", "14:30", "Relais du Vieux Moulin", "feuille de chêne"],
            [6, null, 1, "2026-10-31", "16:40", "Relais du Vieux Moulin", "écorce de bouleau"],
            [7, null, 19, "2026-10-31", "16:55", "Relais de la Clairière", "écorce de bouleau"],
          ],
        },
        passages([...PASSAGES_APRES_MIDI, ...PASSAGES_SOIR]),
        {
          name: "achats",
          description: "Les ventes du Comptoir du Ruisseau en octobre.",
          columns: [
            { name: "id", type: "INTEGER", description: "Numéro de la vente" },
            { name: "animal_id", type: "INTEGER", description: "Acheteur (animaux.id)" },
            { name: "date", type: "TEXT", description: "Date (AAAA-MM-JJ)" },
            { name: "article", type: "TEXT", description: "Ce qui a été acheté" },
            { name: "quantite", type: "INTEGER", description: "Quantité" },
          ],
          rows: [
            [20, 14, "2026-10-15", "peinture dorée", 2],
            [21, 16, "2026-10-20", "écorce de bouleau", 3],
            [22, 10, "2026-10-20", "peinture dorée", 1],
            [23, 19, "2026-10-22", "lanterne", 40],
            [24, 7, "2026-10-24", "peinture dorée", 1],
            [25, 17, "2026-10-26", "peinture dorée", 1],
            [26, 21, "2026-10-27", "gland", 1],
            [27, 13, "2026-10-28", "écorce de bouleau", 2],
            [28, 6, "2026-10-29", "feuille de chêne", 5],
            [29, 20, "2026-10-30", "graines", 12],
            [30, 13, "2026-10-30", "lanterne", 2],
          ],
        },
      ],
      culprit: "Filou",
      hints: [
        "Dans courrier, chercher les lettres reçues par Roux (destinataire_id = 1) qui n'ont pas d'expéditeur. Une valeur manquante se teste avec IS NULL, pas avec = NULL.",
        "Le message a été déposé à un relais, à une heure précise. Les pièges photo (passages) montrent qui se trouvait à ce relais dans les dix minutes autour du dépôt.",
        "Le message est écrit sur un papier particulier. Parmi les animaux présents au relais, un seul en a acheté au Comptoir (table achats).",
      ],
      explanation:
        "Le seul message sans expéditeur reçu par Roux a été déposé au Relais du Vieux Moulin le 31 à 16 h 40, sur de l'écorce de bouleau. Tamia, Filou et Musc sont passés au relais à ce moment-là, mais seul Filou le raton laveur a acheté de l'écorce de bouleau ce mois-ci.",
      twist:
        "Filou avoue avoir écrit le message. Dans son terrier, la garde retrouve le Gland d'Or, caché sous des feuilles ! Mais sur la balance du poste, le trophée ne pèse que 9 g au lieu de 40 g : c'est un faux, un gland ordinaire recouvert de peinture dorée. Filou jure avoir été payé pour écrire le message et emporter le gland de la vitrine pendant la fête, sans savoir qu'il était faux. Le vrai Gland d'Or avait donc disparu avant la Nuit des Lanternes.",
      solutionSql: [
        "SELECT * FROM courrier WHERE destinataire_id = 1 AND expediteur_id IS NULL",
        "SELECT animaux.nom FROM passages JOIN animaux ON animaux.id = passages.animal_id WHERE passages.lieu = 'Relais du Vieux Moulin' AND passages.date = '2026-10-31' AND passages.heure BETWEEN '16:30' AND '16:50'",
        "SELECT DISTINCT animaux.nom FROM passages JOIN animaux ON animaux.id = passages.animal_id WHERE passages.lieu = 'Relais du Vieux Moulin' AND passages.date = '2026-10-31' AND passages.heure BETWEEN '16:30' AND '16:50' AND animaux.id IN (SELECT animal_id FROM achats WHERE article = 'écorce de bouleau')",
      ],
    },
    {
      title: "Le faux trophée",
      story: [
        "Le Gland d'Or retrouvé chez Filou est une copie. Le vrai a donc été échangé plus tôt, pendant qu'il était exposé dans sa vitrine.",
        "La vitrine du Grand Chêne pèse le trophée deux fois par jour, à 8 h et à 20 h. Le registre des gardes indique qui avait la clé de la vitrine, heure par heure.",
      ],
      objective: "Trouver le nom de l'animal qui a remplacé le vrai Gland d'Or par la copie.",
      tables: [
        {
          name: "pesees",
          description: "Les pesées automatiques du trophée dans sa vitrine.",
          columns: [
            { name: "id", type: "INTEGER", description: "Numéro de la pesée" },
            { name: "date", type: "TEXT", description: "Date (AAAA-MM-JJ)" },
            { name: "heure", type: "TEXT", description: "Heure (HH:MM)" },
            { name: "poids_g", type: "INTEGER", description: "Poids mesuré, en grammes" },
          ],
          rows: [
            [1, "2026-10-25", "08:00", 40],
            [2, "2026-10-25", "20:00", 40],
            [3, "2026-10-26", "08:00", 41],
            [4, "2026-10-26", "20:00", 40],
            [5, "2026-10-27", "08:00", 40],
            [6, "2026-10-27", "20:00", 40],
            [7, "2026-10-28", "08:00", 40],
            [8, "2026-10-28", "20:00", 9],
            [9, "2026-10-29", "08:00", 9],
            [10, "2026-10-29", "20:00", 9],
            [11, "2026-10-30", "08:00", 9],
            [12, "2026-10-30", "20:00", 9],
            [13, "2026-10-31", "08:00", 9],
            [14, "2026-10-31", "20:00", 9],
          ],
        },
        {
          name: "gardes",
          description: "Qui gardait la clé de la vitrine, et quand.",
          columns: [
            { name: "id", type: "INTEGER", description: "Numéro de la garde" },
            { name: "animal_id", type: "INTEGER", description: "Le gardien (animaux.id)" },
            { name: "date", type: "TEXT", description: "Date (AAAA-MM-JJ)" },
            { name: "debut", type: "TEXT", description: "Début de la garde (HH:MM)" },
            { name: "fin", type: "TEXT", description: "Fin de la garde (HH:MM)" },
          ],
          rows: [
            [1, 4, "2026-10-26", "08:00", "12:00"],
            [2, 16, "2026-10-26", "12:00", "16:00"],
            [3, 7, "2026-10-26", "16:00", "20:00"],
            [4, 17, "2026-10-27", "08:00", "12:00"],
            [5, 23, "2026-10-27", "12:00", "16:00"],
            [6, 4, "2026-10-27", "16:00", "20:00"],
            [7, 16, "2026-10-28", "08:00", "12:00"],
            [8, 17, "2026-10-28", "12:00", "16:00"],
            [9, 23, "2026-10-28", "16:00", "20:00"],
            [10, 7, "2026-10-29", "08:00", "12:00"],
            [11, 17, "2026-10-29", "12:00", "16:00"],
            [12, 16, "2026-10-29", "16:00", "20:00"],
            [13, 23, "2026-10-30", "08:00", "12:00"],
            [14, 4, "2026-10-30", "12:00", "16:00"],
            [15, 7, "2026-10-30", "16:00", "20:00"],
          ],
        },
      ],
      culprit: "Hermès",
      hints: [
        "Trier les pesées par date puis par heure : à quel moment le poids passe-t-il de 40 g à 9 g ? L'échange a eu lieu entre ces deux pesées.",
        "Dans gardes, garder les gardes de ce jour-là, entre ces deux pesées, et relier chaque garde à son animal.",
        "La copie est recouverte de peinture dorée. Parmi ces gardiens, un seul en a acheté au Comptoir (table achats).",
      ],
      explanation:
        "Le trophée pesait encore 40 g le 28 octobre à 8 h, et 9 g le même jour à 20 h : l'échange a eu lieu ce jour-là. Plume, Hermès et Pépin ont gardé la vitrine entre ces deux pesées, mais seule Hermès l'hermine avait acheté de la peinture dorée, deux jours plus tôt.",
      twist:
        "Hermès finit par avouer l'échange. Mais le vrai Gland d'Or n'est plus chez elle : elle l'a remis le soir même à un commanditaire qui cache son visage, et qui l'a payée par la Banque des Glands, en plusieurs petits virements pour ne pas attirer l'attention. Filou, lui aussi, a été payé par virement. Il reste à suivre l'argent.",
      solutionSql: [
        "SELECT date, heure, poids_g FROM pesees ORDER BY date, heure",
        "SELECT animaux.nom, gardes.debut, gardes.fin FROM gardes JOIN animaux ON animaux.id = gardes.animal_id WHERE gardes.date = '2026-10-28' AND gardes.debut < '20:00' AND gardes.fin > '08:00'",
        "SELECT animaux.nom FROM gardes JOIN animaux ON animaux.id = gardes.animal_id WHERE gardes.date = '2026-10-28' AND gardes.debut < '20:00' AND gardes.fin > '08:00' AND animaux.id IN (SELECT animal_id FROM achats WHERE article = 'peinture dorée')",
      ],
    },
    {
      title: "Suivre les glands",
      story: [
        "La Banque des Glands accepte d'ouvrir ses registres : tous les comptes de la forêt et tous les virements d'octobre. Certains comptes portent un surnom plutôt qu'un nom.",
        "Selon Hermès, le commanditaire lui a versé 200 glands en tout, sans jamais dépasser 50 glands par virement. Le même commanditaire a payé Filou.",
      ],
      objective: "Trouver le nom de l'animal qui a commandé le vol du vrai Gland d'Or.",
      tables: [
        {
          name: "comptes",
          description: "Les comptes ouverts à la Banque des Glands.",
          columns: [
            { name: "id", type: "INTEGER", description: "Numéro du compte" },
            { name: "titulaire_id", type: "INTEGER", description: "À qui appartient le compte (animaux.id)" },
            { name: "intitule", type: "TEXT", description: "Nom affiché sur le compte : un prénom ou un surnom" },
            { name: "ouverture", type: "TEXT", description: "Date d'ouverture (AAAA-MM-JJ)" },
          ],
          rows: [
            [101, 1, "Roux", "2024-03-02"],
            [102, 13, "Filou", "2025-06-14"],
            [103, 17, "Hermès", "2023-11-08"],
            [104, 18, "Sanglou", "2022-01-19"],
            [105, 3, "Biscotte", "2025-02-27"],
            [106, 21, "Gaspard", "2021-09-03"],
            [107, 21, "Ombre", "2026-10-20"],
            [108, 10, "Noisette", "2024-05-11"],
            [109, 16, "Plume", "2023-04-30"],
            [110, 6, "Musc", "2025-10-02"],
            [111, 23, "Pépin", "2024-12-24"],
            [112, 19, "Cerise", "2022-07-07"],
            [113, 19, "Les Lanternes", "2026-09-15"],
          ],
        },
        {
          name: "virements",
          description: "Les virements d'octobre, d'un compte à un autre.",
          columns: [
            { name: "id", type: "INTEGER", description: "Numéro du virement" },
            { name: "de_compte", type: "INTEGER", description: "Compte qui paie (comptes.id)" },
            { name: "vers_compte", type: "INTEGER", description: "Compte qui reçoit (comptes.id)" },
            { name: "date", type: "TEXT", description: "Date (AAAA-MM-JJ)" },
            { name: "montant", type: "INTEGER", description: "Montant, en glands" },
            { name: "motif", type: "TEXT", description: "Motif écrit par celui qui paie" },
          ],
          rows: [
            [1, 112, 113, "2026-10-20", 100, "budget de la fête"],
            [2, 106, 107, "2026-10-21", 250, "épargne"],
            [3, 110, 102, "2026-10-24", 8, "remboursement"],
            [4, 109, 103, "2026-10-26", 5, "tisane"],
            [5, 104, 103, "2026-10-27", 200, "remboursement"],
            [6, 105, 103, "2026-10-27", 10, "cours de saut"],
            [7, 107, 103, "2026-10-28", 50, "noisettes"],
            [8, 107, 103, "2026-10-28", 50, "noisettes"],
            [9, 101, 108, "2026-10-29", 12, "lanternes"],
            [10, 105, 103, "2026-10-29", 10, "cours de saut"],
            [11, 107, 103, "2026-10-29", 50, "champignons"],
            [12, 113, 102, "2026-10-30", 15, "installation des lanternes"],
            [13, 107, 102, "2026-10-30", 30, "petit travail"],
            [14, 107, 103, "2026-10-30", 50, "champignons"],
            [15, 106, 111, "2026-10-30", 5, "graines"],
            [16, 105, 103, "2026-10-31", 10, "cours de saut"],
            [17, 113, 102, "2026-10-31", 15, "installation des lanternes"],
            [18, 113, 103, "2026-10-31", 20, "aide à la fête"],
          ],
        },
      ],
      culprit: "Gaspard",
      hints: [
        "Commencer par trouver, dans comptes, les numéros des comptes d'Hermès et de Filou.",
        "Regrouper les virements reçus par Hermès selon le compte qui paie : combien de virements (COUNT), quel total (SUM), quel plus gros montant (MAX) ? Un seul compte a versé 200 glands sans jamais dépasser 50.",
        "Vérifier que ce compte a aussi payé Filou, puis chercher à qui il appartient : comptes.titulaire_id renvoie à animaux.id.",
      ],
      explanation:
        "Un seul compte a versé 200 glands à Hermès, en quatre virements de 50 : « Ombre », qui a aussi payé Filou la veille de la fête. Ce compte, ouvert le 20 octobre, appartient à Gaspard le corbeau. Tout s'explique : Gaspard a acheté un gland ordinaire le 27, l'a fait peindre et échanger le 28, puis a organisé un faux vol le soir de la fête pour que personne ne pense à peser l'ancien trophée. Son témoignage a lancé l'enquête sur la piste de Roux, et aucun piège photo ne l'a jamais vu passer : il vole. Le vrai Gland d'Or brillait au fond de son nid, en haut du Grand Chêne.",
      solutionSql: [
        "SELECT * FROM comptes WHERE intitule IN ('Hermès', 'Filou')",
        "SELECT de_compte, COUNT(*) AS nombre, SUM(montant) AS total, MAX(montant) AS plus_gros FROM virements WHERE vers_compte = 103 GROUP BY de_compte",
        "SELECT animaux.nom FROM comptes JOIN animaux ON animaux.id = comptes.titulaire_id WHERE comptes.id IN (SELECT de_compte FROM virements WHERE vers_compte = 103 GROUP BY de_compte HAVING SUM(montant) = 200 AND MAX(montant) <= 50) AND comptes.id IN (SELECT de_compte FROM virements WHERE vers_compte = 102)",
      ],
    },
  ],
};

/** Pièges photo du Bois des Détours : la Clairière le 27, puis le Coin aux Cèpes (étape 3), puis le Vieux Moulin (étape 4). */
const PASSAGES_CLAIRIERE: Table["rows"] = [
  [60, 19, "Clairière", "2026-10-27", "07:20"],
  [61, 3, "Clairière", "2026-10-27", "07:40"],
  [62, 20, "Clairière", "2026-10-27", "08:10"],
  [63, 18, "Clairière", "2026-10-27", "08:25"],
  [64, 23, "Clairière", "2026-10-27", "08:50"],
  [65, 14, "Clairière", "2026-10-27", "09:30"],
  [66, 16, "Clairière", "2026-10-27", "10:05"],
  [67, 15, "Mare aux Iris", "2026-10-27", "07:30"],
  [68, 7, "Pont de Pierre", "2026-10-27", "07:45"],
];

const PASSAGES_CEPES: Table["rows"] = [
  [70, 3, "Coin aux Cèpes", "2026-10-20", "15:10"],
  [71, 10, "Coin aux Cèpes", "2026-10-22", "11:30"],
  [72, 23, "Coin aux Cèpes", "2026-10-24", "09:15"],
  [73, 6, "Coin aux Cèpes", "2026-10-25", "10:00"],
  [74, 23, "Coin aux Cèpes", "2026-10-26", "10:40"],
  [75, 6, "Coin aux Cèpes", "2026-10-28", "08:00"],
  [76, 6, "Coin aux Cèpes", "2026-10-28", "10:00"],
  [77, 6, "Coin aux Cèpes", "2026-10-28", "12:00"],
  [78, 6, "Coin aux Cèpes", "2026-10-29", "08:00"],
  [79, 6, "Coin aux Cèpes", "2026-10-29", "10:00"],
  [80, 6, "Coin aux Cèpes", "2026-10-29", "12:00"],
  [81, 6, "Coin aux Cèpes", "2026-10-30", "08:00"],
  [82, 6, "Coin aux Cèpes", "2026-10-30", "10:00"],
  [83, 6, "Coin aux Cèpes", "2026-10-30", "12:00"],
];

const PASSAGES_MOULIN: Table["rows"] = [
  [90, 2, "Vieux Moulin", "2026-10-28", "09:30"],
  [91, 23, "Vieux Moulin", "2026-10-28", "10:50"],
  [92, 13, "Vieux Moulin", "2026-10-29", "08:20"],
  [93, 23, "Vieux Moulin", "2026-10-29", "09:05"],
  [94, 23, "Vieux Moulin", "2026-10-30", "11:10"],
  [95, 20, "Vieux Moulin", "2026-10-30", "11:45"],
];

const pieges = (cepes: string): Table => ({
  name: "pieges",
  description: "Les pièges photo de la forêt et le réglage de leur horloge.",
  columns: [
    { name: "lieu", type: "TEXT", description: "Lieu du piège photo" },
    { name: "horloge", type: "TEXT", description: "Heure affichée sur les photos : heure d'hiver ou heure d'été" },
    { name: "remarque", type: "TEXT", description: "Ce que la garde a noté en vérifiant le piège" },
  ],
  rows: [
    ["Clairière", "heure d'été", "L'horloge n'a pas été changée le 25 octobre."],
    ["Mare aux Iris", "heure d'hiver", "RAS"],
    ["Pont de Pierre", "heure d'hiver", "RAS"],
    ["Coin aux Cèpes", "heure d'hiver", cepes],
    ["Vieux Moulin", "heure d'hiver", "RAS"],
  ],
});

/** Enquête 5 : une forêt qui fait tourner en rond, et une enquête qui finit par revenir à son point de départ. */
const DETOURS: Enquete = {
  slug: "bois-des-detours",
  numero: 5,
  title: "Le Bois des Détours",
  difficulty: "Difficile",
  skills: ["Des sentiers qui tournent en rond", "Comparer deux colonnes", "Se méfier des horloges", "Sous-requête avec NOT IN", "Relier une table à elle-même"],
  pitch: "Chaque promeneur qui entre dans le Bois des Détours ressort… par où il est entré. Les panneaux indiquent de mauvais chemins, la carte aussi, et les registres réservent quelques pièges aux enquêteurs.",
  stageTitle: "Les panneaux qui mentent",
  story: [
    "Depuis le 28 octobre 2026, le Bois des Détours porte bien son nom : chaque promeneur qui part de la Clairière vers le Vieux Moulin finit par revenir… à la Clairière. Biscotte, Tamia et Pépin le lièvre en ont fait l'expérience, Pépin trois matins de suite.",
    "Le 30 octobre, la garde forestière inspecte le bois : plusieurs panneaux n'indiquent pas le bon sentier. Elle a relevé le plan exact des sentiers, ce qui est écrit sur chaque panneau et les traces laissées dessus.",
  ],
  objective: "Trouver le nom de l'animal qui a tourné les panneaux du Bois des Détours.",
  tables: [
    rapports([
      [20, "2026-10-28", "Clairière", "Biscotte est partie vers le Vieux Moulin à 9 h. Elle est revenue à la Clairière à 10 h, sans avoir vu le moulin."],
      [21, "2026-10-29", "Clairière", "Pépin s'est perdu dans le Bois des Détours toute la matinée. Il est revenu à la Clairière vers 11 h, épuisé."],
      [22, "2026-10-29", "Mare aux Iris", "Tamia est passée deux fois devant la mare en voulant aller au Pont de Pierre."],
      [23, "2026-10-30", "Bois des Détours", "Inspection : plusieurs panneaux n'annoncent pas la bonne destination. Les traces relevées sur chaque panneau ont été identifiées."],
    ]),
    temoignages([
      [20, 23, "Hulotte", "Le 28, avant l'aube, un renard roux tripotait les panneaux. Je ne l'ai vu que de dos."],
      [21, 23, "Gaspard", "Roux, évidemment. Croa."],
      [22, 21, "Pépin", "J'ai suivi les panneaux, tout droit, et je suis retombé sur ma Clairière. Trois matins de suite !"],
      [23, 20, "Biscotte", "Le panneau disait « Carrefour du Hêtre ». Je me suis retrouvée devant la Mare aux Iris."],
    ]),
    {
      name: "sentiers",
      description: "Le plan exact du Bois des Détours : chaque sentier, dans un sens de marche.",
      columns: [
        { name: "id", type: "INTEGER", description: "Numéro du sentier" },
        { name: "depart", type: "TEXT", description: "Lieu d'où part le sentier" },
        { name: "arrivee", type: "TEXT", description: "Lieu où il mène vraiment" },
      ],
      rows: [
        [1, "Clairière", "Carrefour du Hêtre"],
        [2, "Carrefour du Hêtre", "Clairière"],
        [3, "Clairière", "Mare aux Iris"],
        [4, "Mare aux Iris", "Clairière"],
        [5, "Carrefour du Hêtre", "Pont de Pierre"],
        [6, "Pont de Pierre", "Carrefour du Hêtre"],
        [7, "Carrefour du Hêtre", "Coin aux Cèpes"],
        [8, "Coin aux Cèpes", "Carrefour du Hêtre"],
        [9, "Pont de Pierre", "Vieux Moulin"],
        [10, "Vieux Moulin", "Pont de Pierre"],
        [11, "Coin aux Cèpes", "Vieux Moulin"],
        [12, "Vieux Moulin", "Coin aux Cèpes"],
        [13, "Mare aux Iris", "Pont de Pierre"],
        [14, "Pont de Pierre", "Mare aux Iris"],
      ],
    },
    {
      name: "panneaux",
      description: "Les panneaux plantés au départ de chaque sentier.",
      columns: [
        { name: "id", type: "INTEGER", description: "Numéro du panneau" },
        { name: "sentier_id", type: "INTEGER", description: "Sentier sur lequel il est planté (sentiers.id)" },
        { name: "carrefour", type: "TEXT", description: "Lieu où se trouve le panneau" },
        { name: "indique", type: "TEXT", description: "Destination écrite sur le panneau" },
      ],
      rows: [
        [101, 1, "Clairière", "Mare aux Iris"],
        [102, 2, "Carrefour du Hêtre", "Clairière"],
        [103, 3, "Clairière", "Carrefour du Hêtre"],
        [104, 4, "Mare aux Iris", "Pont de Pierre"],
        [105, 5, "Carrefour du Hêtre", "Pont de Pierre"],
        [106, 6, "Pont de Pierre", "Carrefour du Hêtre"],
        [107, 7, "Carrefour du Hêtre", "Coin aux Cèpes"],
        [108, 8, "Coin aux Cèpes", "Carrefour du Hêtre"],
        [109, 9, "Pont de Pierre", "Vieux Moulin"],
        [110, 10, "Vieux Moulin", "Pont de Pierre"],
        [111, 11, "Coin aux Cèpes", "Vieux Moulin"],
        [112, 12, "Vieux Moulin", "Coin aux Cèpes"],
        [113, 13, "Mare aux Iris", "Clairière"],
        [114, 14, "Pont de Pierre", "Mare aux Iris"],
      ],
    },
    {
      name: "traces",
      description: "Les traces relevées sur les panneaux, et l'animal à qui elles appartiennent.",
      columns: [
        { name: "id", type: "INTEGER", description: "Numéro de la trace" },
        { name: "panneau_id", type: "INTEGER", description: "Panneau où elle a été trouvée (panneaux.id)" },
        { name: "date", type: "TEXT", description: "Date estimée (AAAA-MM-JJ)" },
        { name: "trace", type: "TEXT", description: "Ce qui a été trouvé" },
        { name: "animal_id", type: "INTEGER", description: "Animal identifié (animaux.id)" },
      ],
      rows: [
        [1, 101, "2026-10-26", "peinture fraîche", 5],
        [2, 103, "2026-10-26", "peinture fraîche", 5],
        [3, 104, "2026-10-26", "peinture fraîche", 5],
        [4, 105, "2026-10-26", "peinture fraîche", 5],
        [5, 113, "2026-10-27", "empreinte de renard", 1],
        [6, 107, "2026-10-27", "plume noire", 21],
        [7, 101, "2026-10-28", "poils roux et blancs", 22],
        [8, 103, "2026-10-28", "poils roux et blancs", 22],
        [9, 104, "2026-10-28", "empreinte de renard", 22],
        [10, 113, "2026-10-28", "poils roux et blancs", 22],
        [11, 103, "2026-10-29", "empreinte de lièvre", 23],
        [12, 109, "2026-10-29", "poils gris et noirs", 7],
      ],
    },
    ANIMAUX,
  ],
  culprit: "Ambre",
  hints: [
    "Relier chaque panneau à son sentier (panneaux.sentier_id = sentiers.id), puis garder les panneaux dont la destination écrite (indique) n'est pas la vraie arrivée. L'opérateur « différent de » s'écrit <> en SQL.",
    "Depuis la Clairière, suivre le panneau « Carrefour du Hêtre » : où mène-t-il vraiment ? Puis, de là, suivre le panneau « Pont de Pierre ». Le chemin revient à son point de départ.",
    "Dans traces, compter pour chaque animal le nombre de panneaux menteurs différents qu'il a touchés (COUNT(DISTINCT …) avec GROUP BY). Un seul les a tous touchés.",
  ],
  explanation:
    "Quatre panneaux mentent, échangés deux par deux : à la Clairière, le panneau « Carrefour du Hêtre » envoie vers la Mare aux Iris, et à la Mare, le panneau « Pont de Pierre » renvoie à la Clairière. Le promeneur tourne en rond. Roux n'a laissé de trace que sur un panneau, Piquet sur trois (il les a repeints le 26). Seule Ambre la renarde, aussi rousse que Roux, a touché les quatre, le 28 avant l'aube.",
  twist:
    "Ambre avoue avoir tourné les quatre panneaux, mais pour bien faire : le 28 avant l'aube, elle les a comparés à la grande carte affichée à la Clairière, et ils ne correspondaient pas. Elle les a donc « corrigés ». Or Piquet les avait repeints le 26, et ils étaient justes. En réalité, c'est la carte qui était fausse. Qui l'a affichée ?",
  solutionSql: [
    "SELECT panneaux.id, panneaux.carrefour, panneaux.indique, sentiers.arrivee FROM panneaux JOIN sentiers ON sentiers.id = panneaux.sentier_id WHERE panneaux.indique <> sentiers.arrivee",
    "SELECT animaux.nom FROM traces JOIN panneaux ON panneaux.id = traces.panneau_id JOIN sentiers ON sentiers.id = panneaux.sentier_id JOIN animaux ON animaux.id = traces.animal_id WHERE panneaux.indique <> sentiers.arrivee GROUP BY animaux.nom HAVING COUNT(DISTINCT panneaux.id) = 4",
  ],
  next: [
    {
      title: "La carte de la Clairière",
      story: [
        "Le 27 octobre, la garde fait sa ronde à la Clairière à 7 h : l'ancienne carte est au tableau. À 8 h, une nouvelle carte l'a remplacée, punaisée à plus d'un mètre du sol. Seul un animal d'au moins 100 cm a pu l'atteindre.",
        "La montre de la garde est à l'heure d'hiver, comme toute la forêt depuis le 25 octobre. La nouvelle carte a été recopiée dans un registre, et la garde a joint la liste des pièges photo avec le réglage de leur horloge.",
      ],
      objective: "Trouver le nom de l'animal qui a affiché la fausse carte à la Clairière.",
      tables: [
        {
          name: "carte",
          description: "La carte affichée à la Clairière depuis le 27 octobre : où mène chaque sentier, d'après elle.",
          columns: [
            { name: "sentier_id", type: "INTEGER", description: "Sentier dessiné sur la carte (sentiers.id)" },
            { name: "arrivee", type: "TEXT", description: "Lieu où il mène, d'après la carte" },
          ],
          rows: [
            [1, "Mare aux Iris"],
            [2, "Clairière"],
            [3, "Carrefour du Hêtre"],
            [4, "Pont de Pierre"],
            [5, "Pont de Pierre"],
            [6, "Carrefour du Hêtre"],
            [9, "Vieux Moulin"],
            [10, "Pont de Pierre"],
            [13, "Clairière"],
            [14, "Mare aux Iris"],
          ],
        },
        pieges("RAS"),
        passages(PASSAGES_CLAIRIERE),
      ],
      culprit: "Sanglou",
      hints: [
        "Relier carte et sentiers par le numéro du sentier : la carte donne-t-elle les vraies arrivées ? Ses erreurs sont exactement les « corrections » d'Ambre.",
        "Dans passages, garder les photos de la Clairière du 27 octobre entre 7 h et 8 h, puis les relier à animaux. Mais d'abord, lire la table pieges : à quelle heure est réglé le piège de la Clairière ?",
        "Une horloge restée à l'heure d'été avance d'une heure : 7 h à la montre de la garde s'affiche 08:00 sur le piège. Chercher donc entre 08:00 et 09:00, puis garder les animaux d'au moins 100 cm.",
      ],
      explanation:
        "La carte affichée donne une fausse arrivée à quatre sentiers, ceux qu'Ambre a « corrigés ». Le piège de la Clairière est resté à l'heure d'été : ses photos ont une heure d'avance, et la ronde de 7 h à 8 h correspond à 08:00 à 09:00 sur le piège. Un seul animal d'au moins 100 cm y apparaît : Sanglou le sanglier, à 08:25, donc 7 h 25. Cerise, photographiée à 07:20, était en réalité passée à 6 h 20, avant la première ronde.",
      twist:
        "Sanglou reconnaît avoir punaisé la carte, mais il ne l'a pas dessinée : il l'a trouvée roulée devant son terrier le 26 au soir, avec un mot : « Nouvelle carte du Bois, à afficher demain matin à la Clairière. La garde. » La garde n'a jamais écrit ce mot. En comparant la fausse carte à la vraie, il doit être possible de découvrir à qui profite le détour.",
      solutionSql: [
        "SELECT carte.sentier_id, carte.arrivee, sentiers.arrivee FROM carte JOIN sentiers ON sentiers.id = carte.sentier_id WHERE carte.arrivee <> sentiers.arrivee",
        "SELECT * FROM pieges WHERE lieu = 'Clairière'",
        "SELECT animaux.nom FROM passages JOIN animaux ON animaux.id = passages.animal_id WHERE passages.lieu = 'Clairière' AND passages.date = '2026-10-27' AND passages.heure BETWEEN '08:00' AND '09:00' AND animaux.taille_cm >= 100",
      ],
    },
    {
      title: "À qui profite le détour ?",
      story: [
        "La fausse carte ne se contente pas d'échanger des sentiers : certains n'y figurent plus du tout. Un lieu entier du Bois des Détours a disparu de la carte, et plus aucun promeneur ne peut le trouver.",
        "La garde a dépouillé les photos de tous les pièges du bois depuis le 20 octobre.",
      ],
      objective: "Trouver le nom du seul animal photographié, depuis l'affichage de la fausse carte, au lieu que cette carte fait disparaître.",
      tables: [passages([...PASSAGES_CLAIRIERE, ...PASSAGES_CEPES])],
      culprit: "Musc",
      hints: [
        "Quels lieux sont des arrivées dans sentiers, mais jamais dans carte ? Une sous-requête avec NOT IN répond à la question.",
        "La carte a été affichée le 27 octobre. Dans passages, garder les photos de ce lieu prises à partir de cette date : les dates s'écrivent AAAA-MM-JJ, elles se comparent donc comme du texte.",
        "Relier ces passages à animaux. Avec DISTINCT, un seul nom reste.",
      ],
      explanation:
        "Sur la fausse carte, aucun sentier ne mène plus au Coin aux Cèpes : les quatre sentiers qui le desservent ont disparu. Depuis le 27 octobre, le piège du Coin aux Cèpes n'a photographié qu'un seul animal, trois fois par matin : Musc le putois. Biscotte, Noisette et Pépin y sont passés, mais avant la fausse carte.",
      twist:
        "Musc n'a rien d'un voleur : depuis des années, il est le gardien des cèpes, et il les compte trois fois par matin, à 8 h, 10 h et midi. Son cahier montre pourtant que des cèpes disparaissent entre deux de ses tournées, alors qu'aucun autre animal n'apparaît sur les photos. En vérifiant le piège, la garde découvre qu'il ne filme que le sentier nord. Le voleur arrive donc par le sentier sud, celui du Vieux Moulin, à des heures où personne ne pense à le chercher là.",
      solutionSql: [
        "SELECT DISTINCT arrivee FROM sentiers WHERE arrivee NOT IN (SELECT arrivee FROM carte)",
        "SELECT DISTINCT animaux.nom FROM passages JOIN animaux ON animaux.id = passages.animal_id WHERE passages.lieu = 'Coin aux Cèpes' AND passages.date >= '2026-10-27'",
      ],
    },
    {
      title: "Retour au point de départ",
      story: [
        "Le cahier de comptage de Musc est versé au dossier. Depuis le 28 octobre, plusieurs animaux sont venus déclarer au poste de garde qu'ils s'étaient perdus dans le Bois des Détours, avec l'heure de leur départ et celle de leur retour.",
        "Se dire perdu est un bon alibi : personne ne s'étonne de ne pas voir un promeneur égaré. Les photos du piège du Vieux Moulin ont été ajoutées aux passages.",
      ],
      objective: "Trouver le nom de l'animal qui ramasse les cèpes en cachette.",
      tables: [
        {
          name: "comptages",
          description: "Le cahier de Musc : le nombre de cèpes au Coin aux Cèpes, à chaque tournée.",
          columns: [
            { name: "id", type: "INTEGER", description: "Numéro du comptage, dans l'ordre des tournées" },
            { name: "date", type: "TEXT", description: "Date (AAAA-MM-JJ)" },
            { name: "heure", type: "TEXT", description: "Heure du comptage (HH:MM)" },
            { name: "cepes", type: "INTEGER", description: "Nombre de cèpes comptés" },
          ],
          rows: [
            [1, "2026-10-28", "08:00", 40],
            [2, "2026-10-28", "10:00", 40],
            [3, "2026-10-28", "12:00", 31],
            [4, "2026-10-29", "08:00", 52],
            [5, "2026-10-29", "10:00", 44],
            [6, "2026-10-29", "12:00", 44],
            [7, "2026-10-30", "08:00", 50],
            [8, "2026-10-30", "10:00", 50],
            [9, "2026-10-30", "12:00", 41],
          ],
        },
        {
          name: "declarations",
          description: "Les animaux venus déclarer qu'ils s'étaient perdus dans le Bois des Détours.",
          columns: [
            { name: "id", type: "INTEGER", description: "Numéro de la déclaration" },
            { name: "animal_id", type: "INTEGER", description: "Qui s'est perdu (animaux.id)" },
            { name: "date", type: "TEXT", description: "Date (AAAA-MM-JJ)" },
            { name: "debut", type: "TEXT", description: "Heure du départ (HH:MM)" },
            { name: "fin", type: "TEXT", description: "Heure du retour (HH:MM)" },
            { name: "texte", type: "TEXT", description: "Ce que l'animal a raconté" },
          ],
          rows: [
            [1, 3, "2026-10-28", "09:00", "10:00", "Partie vers le Vieux Moulin, revenue à la Clairière."],
            [2, 23, "2026-10-28", "10:00", "12:00", "J'ai tourné en rond toute la matinée."],
            [3, 20, "2026-10-29", "08:00", "10:30", "Deux fois devant la Mare aux Iris !"],
            [4, 23, "2026-10-29", "08:00", "11:00", "Encore perdu. Ces panneaux sont ensorcelés."],
            [5, 23, "2026-10-30", "09:30", "12:00", "Troisième matin perdu. Que fait la garde ?"],
            [6, 3, "2026-10-30", "10:00", "11:00", "Je voulais seulement aller au Pont de Pierre."],
            [7, 16, "2026-10-30", "10:00", "12:00", "Égarée en rentrant de la chasse."],
          ],
        },
        pieges("Le piège ne filme que le sentier nord, celui du Carrefour du Hêtre. Le sentier sud, celui du Vieux Moulin, n'est pas surveillé."),
        passages([...PASSAGES_CLAIRIERE, ...PASSAGES_CEPES, ...PASSAGES_MOULIN]),
      ],
      culprit: "Pépin",
      hints: [
        "Trier comptages par id : entre quelles tournées le nombre de cèpes baisse-t-il ? Pour comparer chaque comptage au suivant, relier la table à elle-même : comptages AS avant JOIN comptages AS apres ON apres.id = avant.id + 1.",
        "Pendant une baisse, le voleur n'était pas chez lui. Dans declarations, chercher qui se disait perdu pendant toute la baisse : départ au plus tard à la première tournée, retour au plus tôt à la suivante, le même jour.",
        "Un seul animal se disait perdu pendant les trois baisses. Les photos du Vieux Moulin, un lieu que les promeneurs perdus n'atteignent jamais, confirment la piste.",
      ],
      explanation:
        "Les cèpes disparaissent trois fois : le 28 entre 10 h et midi, le 29 entre 8 h et 10 h, le 30 entre 10 h et midi. Pépin le lièvre se disait perdu à chacun de ces moments, et pourtant le piège du Vieux Moulin l'a photographié pendant chacune de ses « errances » : il rejoignait le Coin aux Cèpes par le sentier sud, que le piège ne voit pas. Tout s'explique : Pépin a découvert le coin à cèpes le 24, a dessiné la fausse carte qui le fait disparaître, l'a fait afficher par Sanglou, puis a joué les promeneurs perdus pour se donner un alibi. Le plaignant du premier jour était le coupable, et il habite… à la Clairière, le point de départ de tous les détours.",
      solutionSql: [
        "SELECT avant.date, avant.heure, apres.heure, avant.cepes - apres.cepes AS disparus FROM comptages AS avant JOIN comptages AS apres ON apres.id = avant.id + 1 AND apres.date = avant.date WHERE apres.cepes < avant.cepes",
        "SELECT animaux.nom FROM declarations JOIN animaux ON animaux.id = declarations.animal_id JOIN comptages AS avant ON avant.date = declarations.date JOIN comptages AS apres ON apres.id = avant.id + 1 AND apres.date = avant.date WHERE apres.cepes < avant.cepes AND declarations.debut <= avant.heure AND declarations.fin >= apres.heure GROUP BY animaux.nom HAVING COUNT(*) = 3",
      ],
    },
  ],
};

export const ENQUETES: Enquete[] = [OEUFS, MIEL, BARRAGE, GLAND, DETOURS];

export function getEnquete(slug: string): Enquete | undefined {
  return ENQUETES.find((item) => item.slug === slug);
}
