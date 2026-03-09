# Rapport d'Audit de Performance & Optimisation

Ce rapport analyse la structure actuelle de l'application Next.js et propose des optimisations concrètes pour améliorer la réactivité et la vitesse de chargement (Core Web Vitals).

## 📊 État des Lieux

L'application est construite avec **Next.js 14+ (App Router)** et utilise **Supabase** pour l'authentification. Elle est globalement bien structurée mais souffre de quelques goulots d'étranglement qui affectent le *First Contentful Paint (FCP)* et le *Total Blocking Time (TBT)*.

### Points Critiques Identifiés :

1.  **Blocage du Rendu Initial (Client-Side Rendering excessif)**
    *   `layout.tsx` et `page.tsx` utilisent `"use client"`. Cela signifie que toute la page est rendue côté client, perdant les bénéfices du SSR (Server Side Rendering) de Next.js. Le navigateur doit télécharger, parser et exécuter tout le JS avant d'afficher quoi que ce soit.
    *   **Impact :** Écran blanc plus long au démarrage, SEO moins efficace.

2.  **Logique Bloquante dans `layout.tsx`**
    *   Un `setTimeout` artificiel de 2000ms (`setIsAppLoading`) force l'affichage du `FoxLoader` à chaque rechargement complet, même si la page est prête.
    *   L'authentification Supabase (`getSession` + `onAuthStateChange`) est effectuée au montage du composant racine, bloquant potentiellement l'interactivité.

3.  **Chargement des Ressources**
    *   Les images (ex: `fox_0.png`) sont chargées via `next/image` mais sans stratégie de préchargement (preload) explicite pour les images "above the fold" (au-dessus de la ligne de flottaison).
    *   Le fichier `katex.min.css` est importé globalement, ce qui peut bloquer le rendu s'il est lourd.

4.  **Re-rendus Inutiles**
    *   Le composant `FoxLoader` utilise un `setInterval` de 30ms pour l'animation, ce qui force des re-rendus très fréquents (33 fois/seconde) sur le thread principal pendant le chargement.

---

## 🚀 Plan d'Optimisation

Voici les actions recommandées pour booster la réactivité :

### 1. Passer en Server Components (Priorité Haute)
*   **Action :** Retirer `"use client"` de `layout.tsx` et `page.tsx`.
*   **Comment :** Déplacer la logique interactive (Auth, Loader, Search) dans des composants isolés (ex: `<AuthManager />`, `<HeaderSearch />`).
*   **Gain :** Le HTML initial est envoyé immédiatement au navigateur. Le FCP devient quasi-instantané.

### 2. Optimiser le Loader (Priorité Moyenne)
*   **Action :** Supprimer le délai artificiel de 2 secondes. Le loader ne doit s'afficher que si le chargement est *réellement* en cours.
*   **Comment :** Utiliser `loading.tsx` natif de Next.js pour les transitions de route, et réserver le `FoxLoader` pour l'initialisation de l'auth uniquement si nécessaire.

### 3. Stratégie d'Images (Priorité Moyenne)
*   **Action :** Ajouter la propriété `priority` aux images des renards de la page d'accueil.
*   **Code :** `<Image src="..." priority ... />`
*   **Gain :** Le navigateur charge ces images en priorité absolue, améliorant le LCP (Largest Contentful Paint).

### 4. Code Splitting & Lazy Loading
*   **Action :** Charger les composants lourds (ex: les graphiques interactifs dans `/lab`) uniquement quand ils sont visibles.
*   **Code :** `const Graph = dynamic(() => import('./Graph'))`

### 5. Optimisation CSS
*   **Action :** Vérifier que Tailwind purge bien les classes inutilisées (c'est le cas avec la config actuelle).
*   **Action :** Charger KaTeX uniquement sur les pages de cours de Maths/NSI, pas sur la Home.

---

## 📝 Exemple de Refactoring : `layout.tsx`

**Avant (Actuel - Bloquant) :**
```tsx
"use client"
export default function RootLayout(...) {
  // Tout le code JS s'exécute ici avant l'affichage
  useEffect(() => { ...auth... }, [])
  return <html>...</html>
}
```

**Après (Optimisé - Hybride) :**
```tsx
// layout.tsx (Serveur par défaut)
import { ClientProviders } from './providers'; // Nouveau composant client

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ClientProviders>
           {children}
        </ClientProviders>
      </body>
    </html>
  )
}
```

## ✅ Conclusion

En migrant vers une architecture **Server-First**, vous allez diviser par deux le temps avant interactivité (TTI). L'application semblera beaucoup plus "légère" et réactive, surtout sur mobile.
