import { describe, expect, it } from "vitest";
import {
  CHASSE_BASE_IMAGE,
  CHASSE_EN_IMAGE,
  CHASSE_ES_IMAGE,
  chasseEditionHref,
  chasseImage,
  chasseSelectionFromSlug,
  chasseShowsPremieresChoice,
} from "../lib/chasse-project-editions";

describe("illustrations chasse aux ren'arts", () => {
  it("garde l'image de base pour le français 2026-2027 et les premières", () => {
    expect(chasseImage("2026-2027", "fr")).toBe(CHASSE_BASE_IMAGE);
    expect(chasseImage("premieres", "fr")).toBe(CHASSE_BASE_IMAGE);
  });

  it("affiche l'illustration anglaise ou espagnole seulement pour 2026-2027", () => {
    expect(chasseImage("2026-2027", "en")).toBe(CHASSE_EN_IMAGE);
    expect(chasseImage("2026-2027", "es")).toBe(CHASSE_ES_IMAGE);
    expect(chasseImage("premieres", "en")).toBe(CHASSE_BASE_IMAGE);
    expect(chasseImage("premieres", "es")).toBe(CHASSE_BASE_IMAGE);
  });

  it("relie chaque bouton à la bonne page", () => {
    expect(chasseSelectionFromSlug("Projet_Chasse_aux_ren_arts_anglais")).toEqual({
      year: "2026-2027",
      lang: "en",
    });
    expect(chasseSelectionFromSlug("Projet_Chasse_aux_ren_arts_espagnol")).toEqual({
      year: "2026-2027",
      lang: "es",
    });
    expect(chasseSelectionFromSlug("Projet_Chasse_aux_ren_arts", "2026-2027")).toEqual({
      year: "2026-2027",
      lang: "fr",
    });
    expect(chasseSelectionFromSlug("Projet_Chasse_aux_ren_arts")).toEqual({
      year: "premieres",
      lang: "fr",
    });
    expect(chasseEditionHref("snt", "2026-2027", "en")).toBe(
      "/cours/snt/Projet_Chasse_aux_ren_arts_anglais"
    );
    expect(chasseEditionHref("snt", "2026-2027", "es")).toBe(
      "/cours/snt/Projet_Chasse_aux_ren_arts_espagnol"
    );
    expect(chasseEditionHref("snt", "premieres", "fr")).toBe("/cours/snt/Projet_Chasse_aux_ren_arts");
  });

  it("cache les premières sur tous les sélecteurs de Seconde", () => {
    expect(chasseShowsPremieresChoice("snt")).toBe(false);
    expect(chasseShowsPremieresChoice("snt", "Projet_Chasse_aux_ren_arts")).toBe(false);
    expect(chasseShowsPremieresChoice("snt", "Projet_Chasse_aux_ren_arts_anglais")).toBe(false);
    expect(chasseShowsPremieresChoice("snt", "Projet_Chasse_aux_ren_arts_espagnol")).toBe(false);
    expect(chasseShowsPremieresChoice("1", "Projet_Chasse_aux_ren_arts")).toBe(false);
  });

  it("garde les premières sur une fiche Première française, pas sur l'anglais ni l'espagnol", () => {
    expect(chasseShowsPremieresChoice("1nsi")).toBe(true);
    expect(chasseShowsPremieresChoice("1nsi", "Projet_Chasse_aux_ren_arts")).toBe(true);
    expect(chasseShowsPremieresChoice("2", "Projet_Chasse_aux_ren_arts")).toBe(true);
    expect(chasseShowsPremieresChoice("1nsi", "Projet_Chasse_aux_ren_arts_anglais")).toBe(false);
    expect(chasseShowsPremieresChoice("1nsi", "Projet_Chasse_aux_ren_arts_espagnol")).toBe(false);
  });
});
