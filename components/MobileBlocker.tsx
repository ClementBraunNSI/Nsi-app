"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Monitor } from 'lucide-react';

export default function MobileBlocker() {
  const [shouldBlock, setShouldBlock] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      // Bloquer entre 8h00 (inclus) et 17h00 (exclus)
      const isSchoolHours = hours >= 8 && hours < 17;
      setShouldBlock(isSchoolHours);
    };

    checkTime();
    // Vérifier chaque minute si l'heure a changé
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!shouldBlock) return null;

  // Même monde que la page 403 : le renard devant la barrière fermée.
  return (
    <div className="course-blocker" role="alertdialog" aria-modal="true" aria-labelledby="course-blocker-title" aria-describedby="course-blocker-text">
      <span className="ide-rotate-chip">
        <Clock size={14} aria-hidden />
        Bloqué de 08:00 à 17:00
      </span>
      <div className="course-blocker-figure">
        <Image src="/images/http_403.svg" alt="Le renard regarde une barrière fermée par un cadenas" width={1536} height={1024} />
      </div>
      <h2 id="course-blocker-title">Mode ordinateur requis</h2>
      <p id="course-blocker-text">
        Pour garantir des conditions d&apos;examen équitables et éviter la triche, l&apos;accès à ce cours est bloqué sur mobile et
        tablette pendant les heures de cours.
      </p>
      <p className="course-blocker-hint">
        <Monitor size={16} aria-hidden />
        Utiliser un ordinateur, portable ou de bureau.
      </p>
      <Link href="/" className="ide-rotate-back">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
