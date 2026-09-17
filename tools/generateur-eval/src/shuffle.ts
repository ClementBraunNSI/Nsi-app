import type { BankQuestion } from '@nsi-tools/shared/types';

/** Mulberry32 seeded PRNG */
function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleQuestions(
  questions: BankQuestion[],
  seed?: string,
): BankQuestion[] {
  const copy = [...questions];
  if (!seed?.trim()) {
    return copy.sort(() => Math.random() - 0.5);
  }

  let numericSeed = 0;
  for (let i = 0; i < seed.length; i += 1) {
    numericSeed = (numericSeed * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const rng = createRng(numericSeed);
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
