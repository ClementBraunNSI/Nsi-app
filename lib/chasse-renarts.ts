/**
 * Chasse aux Ren'Arts : tableaux générés par IA que les élèves envoient depuis l'accueil, pour que l'enseignant les garde.
 * Module partagé navigateur et serveur ; seule prepareArtwork a besoin du navigateur.
 * Les classes acceptées ne sont pas ici : seule la base les connaît (chasse_renart_create), le site ne les montre pas.
 */

export const RENART_PRENOM_MAX = 40;
export const RENART_CLASSE_MAX = 12;
/** Tailles maximales des data URL, alignées sur les contraintes de la table. */
export const RENART_IMAGE_MAX = 2_500_000;
export const RENART_THUMB_MAX = 110_000;
const THUMB_SIDE = 360;

/** Tableau tel que l'enseignant le liste ; l'image en grand se charge à part, à l'ouverture. */
export type Renart = {
  id: string;
  createdAt: string;
  prenom: string;
  classe: string;
  thumbnail: string;
};

/** Image acceptée : une data URL JPEG, pas trop lourde. */
export function isValidRenartImage(value: unknown, max: number) {
  return typeof value === "string" && value.length <= max && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(value);
}

/** Nom du fichier téléchargé : la classe puis le prénom sans accents, « <classe>_Zoe.jpg ». */
export function renartFileName(renart: Pick<Renart, "classe" | "prenom">) {
  const prenom = renart.prenom.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${renart.classe}_${prenom || "eleve"}.jpg`;
}

function toJpeg(bitmap: ImageBitmap, side: number, quality: number) {
  const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("L'image n'a pas pu être préparée.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

/** Première version qui tient dans la taille permise, de la plus fidèle à la plus réduite. */
function fit(bitmap: ImageBitmap, sides: number[], qualities: number[], max: number) {
  for (const side of sides) {
    for (const quality of qualities) {
      const data = toJpeg(bitmap, side, quality);
      if (data.length <= max) return data;
    }
  }
  return null;
}

/**
 * Tableau réencodé en JPEG dans le navigateur (2048 px au plus, sans agrandir) et sa vignette,
 * pour rester sous la taille permise : les PNG des générateurs d'images pèsent souvent 2 à 4 Mo.
 */
export async function prepareArtwork(file: Blob): Promise<{ image: string; thumbnail: string }> {
  if (!file.type.startsWith("image/")) throw new Error("Le fichier choisi n'est pas une image.");
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Cette image n'a pas pu être lue : enregistre-la en PNG ou en JPEG puis réessaie.");
  }
  try {
    const image = fit(bitmap, [2048, 1600, 1200], [0.92, 0.84, 0.75], RENART_IMAGE_MAX);
    const thumbnail = fit(bitmap, [THUMB_SIDE], [0.8, 0.65, 0.5], RENART_THUMB_MAX);
    if (!image || !thumbnail) throw new Error("L'image est trop lourde, même compressée.");
    return { image, thumbnail };
  } finally {
    bitmap.close();
  }
}
