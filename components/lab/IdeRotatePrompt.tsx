"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Smartphone } from "lucide-react";

/** Même condition que l'affichage de .ide-rotate dans globals.css : un téléphone tenu en portrait. */
const PORTRAIT_PHONE = "(orientation: portrait) and (max-width: 599px)";

/** Vrai quand le téléphone est en portrait : l'IDE passe alors en inerte sous l'invitation à tourner l'écran. */
export function usePortraitPhone() {
  const [portrait, setPortrait] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(PORTRAIT_PHONE);
    const update = () => setPortrait(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return portrait;
}

/**
 * Sur téléphone en portrait, l'IDE est trop étroit : l'élève connecté qui ouvre un exercice est invité
 * à passer en paysage. L'affichage dépend du CSS seul, il n'y a donc pas de clignotement au chargement ;
 * l'invitation disparaît d'elle-même dès que le téléphone est tourné.
 */
export function IdeRotatePrompt({ backHref, label }: { backHref: string; label: string }) {
  return (
    <div className="ide-rotate" role="alertdialog" aria-modal="true" aria-labelledby="ide-rotate-text" aria-describedby="ide-rotate-exercise">
      <span className="ide-rotate-chip" aria-hidden="true">
        <Smartphone size={16} />
        <RotateCcw size={14} />
        Format paysage
      </span>
      <div className="ide-rotate-figure">
        <Image src="/images/ide_paysage.svg" alt="Le renard tourne le téléphone en format paysage" width={1110} height={590} priority />
      </div>
      <p id="ide-rotate-text" className="ide-rotate-text">
        Pour faciliter l&apos;utilisation de l&apos;IDE, le téléphone doit être en format paysage
      </p>
      <p id="ide-rotate-exercise" className="ide-rotate-exercise">
        {label}
      </p>
      <Link href={backHref} className="ide-rotate-back">
        <ArrowLeft size={16} aria-hidden />
        Retour à la fiche
      </Link>
    </div>
  );
}
