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
  pitch: "Les ruches de la clairière ont été pillées en plein après-midi. Une empreinte, trois suspects, des alibis à vérifier.",
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
    "Une empreinte de 9 cm, c'est un blaireau. Trois blaireaux vivent dans la forêt : Grisou, Moka et Bourru. Grisou jouait aux cartes et Moka faisait le marché pendant le vol. Bourru, lui, n'a d'alibi que le matin : c'est lui, le voleur de miel.",
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

export const ENQUETES: Enquete[] = [OEUFS, MIEL, BARRAGE];

export function getEnquete(slug: string): Enquete | undefined {
  return ENQUETES.find((item) => item.slug === slug);
}
