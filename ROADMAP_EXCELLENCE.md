# 🏆 Roadmap vers l'Excellence : Audit & Recommandations

Pour que votre site devienne **LA référence** pour l'inspection NSI, il ne doit pas être un simple manuel numérique, mais un véritable **Laboratoire d'Apprentissage**.

Voici les 4 piliers manquants ou à renforcer pour impressionner un inspecteur :

## 1. Pédagogie Active & Immédiate (Le "Faire")
Un inspecteur cherche à voir si l'élève est *actif*.
*   🔴 **Manquant : Exécution Python en direct.** Actuellement, l'élève doit copier-coller le code dans Thonny. C'est une friction. Il faut un interpréteur Python (Pyodide) intégré directement dans la page.
*   🟠 **À améliorer : Exercices à trous (Parsons Puzzles).** Pour les débutants (1ère), écrire du code de zéro est dur. Ordonner des blocs de code est pédagogiquement supérieur pour comprendre la logique sans bloquer sur la syntaxe.
*   🟠 **À améliorer : Feedback immédiat.** Les quiz doivent expliquer *pourquoi* une réponse est fausse.

## 2. UX/UI & Navigation (L'Expérience "App")
Un site moderne doit se comporter comme une application fluide.
*   🔴 **Manquant : Recherche Globale (Command Palette).** Comme sur les docs modernes (Vercel, Tailwind), un `Ctrl+K` pour trouver n'importe quel concept (ex: "boucle for", "TCP/IP") instantanément.
*   🟠 **À améliorer : Fil d'Ariane intelligent.** Savoir exactement où on est dans le programme officiel (ex: "Thème 1 > Types de base > Entiers").
*   🟢 **Acquis :** Vos visualisateurs (Dichotomie, Tri) sont excellents. Continuez !

## 3. Accessibilité & Inclusion (Le Critère "Éducation Nationale")
L'école inclusive est une priorité absolue.
*   🔴 **Manquant : Police Luciole.** Pour les dyslexiques, il est recommandé d'utiliser la police **Luciole** sur l'ensemble du site. Elle a été conçue spécifiquement pour faciliter la lecture.
*   🔴 **Manquant : Contrôle de la Police.** Permettre de changer la taille du texte sans plugin.
*   🟠 **À améliorer : Contraste & Mode Sombre.** Vérifier que tous les textes sont lisibles (WCAG AA).

## 4. Outils Enseignant (La "Preuve" d'Usage)
Si l'inspecteur voit que vous pensez aux collègues, c'est gagné.
*   🔴 **Manquant : Mode "Professeur".** Un bouton qui affiche les "intentions pédagogiques", les pré-requis et les pièges à éviter pour chaque cours (visible seulement par les profs).
*   🔴 **Manquant : Export PDF propre.** Pour les élèves sans connexion.

---

## 🚀 Plan d'Action Immédiat (Ce que je vais faire maintenant)

Je vais implémenter le point le plus critique : **Le Playground Python Intégré**.
Cela transformera votre site de "Livre" à "Plateforme de Code".
