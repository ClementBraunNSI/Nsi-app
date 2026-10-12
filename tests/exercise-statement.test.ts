import { describe, expect, it } from 'vitest';
import { splitStatement } from '../lib/exercise-statement';

describe('exercise statement sections', () => {
  it('keeps the task and does not invent consignes, hints, examples, or the solution', () => {
    const parts = splitStatement(
      [
        '### Exercice 1.1 [Facile] : Majeur ou mineur',
        '',
        '**Écrire une fonction `est_majeur` qui prend un âge (entier) en paramètre et renvoie `True` si la personne est majeure (âge supérieur ou égal à 18), `False` sinon. Utilisez un `if` / `else`.**',
        '',
        '<Correction>',
        '```python',
        'def est_majeur(age):',
        '    return age >= 18',
        '```',
        '</Correction>',
      ].join('\n'),
      '1.1 [Facile] - Majeur ou mineur',
    );

    expect(parts.enonce).toMatch(/est_majeur/);
    expect(parts.enonce).not.toMatch(/Exercice 1\.1/);
    expect(parts.enonce).not.toMatch(/return age/);
    expect(parts.consignes).toBeUndefined();
    expect(parts.indice).toBeUndefined();
    expect(parts.exemples).toBeUndefined();
  });

  it('lifts a real hint section and leaves an inline example in the énoncé', () => {
    const parts = splitStatement(
      [
        '### Somme des entiers',
        'Écrivez une fonction récursive `somme(n)`.',
        '*   Exemple : `somme(4)` doit renvoyer `10`.',
        '',
        '**Indices :**',
        '*   Cas de base : n = 0.',
        '*   Récursion : `somme(n) = n + somme(n - 1)`.',
        '',
        '### Correction',
        '```python',
        'def somme(n):',
        '    return 0',
        '```',
      ].join('\n'),
      'Somme Récursive',
    );

    expect(parts.enonce).toMatch(/fonction récursive/);
    expect(parts.enonce).toMatch(/somme\(4\)/);
    expect(parts.enonce).toMatch(/Somme des entiers/);
    expect(parts.enonce).not.toMatch(/return 0/);
    expect(parts.indiceTitle).toBe('Indice');
    expect(parts.indice).toMatch(/Cas de base/);
    expect(parts.consignes).toBeUndefined();
    expect(parts.exemples).toBeUndefined();
  });

  it('keeps a one-line hint out of the following énoncé', () => {
    const parts = splitStatement(
      [
        'Écrivez `infixe`.',
        '**Indice :** Utilisez un parcours infixe.',
        'Le parcours doit être croissant.',
      ].join('\n'),
    );

    expect(parts.indice).toBe('Utilisez un parcours infixe.');
    expect(parts.enonce).toMatch(/infixe/);
    expect(parts.enonce).toMatch(/croissant/);
    expect(parts.enonce).not.toMatch(/parcours infixe/);
  });
});
