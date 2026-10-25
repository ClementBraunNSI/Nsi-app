---
title: 'Atelier Localisation : Trilateration'
description: Comprendre le fonctionnement du GPS avec les satellites.
level: '2'
chapter: Localisation
icon: "radio-tower"
prerequisites:
  - Cours_Localisation
audience: public
---

<ExerciseTabs courseId="trilateration-gps" courseTitle="Atelier GPS : La Trilateration">
  <ExerciseSection id="mission-gps" label="Mission : Retrouver le Renard" type="lecture">
    <Enonce>
### <Icone nom="radio-tower" /> Mission : Retrouver le Renard

Pour calculer sa position, un téléphone écoute les signaux d'au moins 3 satellites. C'est le principe de la **trilatération**.

**Objectif :** Le renard se cache. Utiliser les signaux des satellites Galileo pour trianguler sa position exacte.

1.  **Lancer la mission** pour activer le premier satellite.
2.  **Ajuster le rayon** (cercle) de chaque satellite en fonction du temps mis par le signal pour arriver.
    *   *Rappel : Distance = Vitesse × Temps*
    *   *Vitesse du signal = 300 m / µs (300 000 km/s)*
3.  L'intersection des 3 cercles donne la position exacte du renard.

<TrilaterationMap />
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>
