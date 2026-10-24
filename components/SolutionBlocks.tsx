import type { ReactNode } from 'react';

/** Server components: children are not rendered and are not passed to the client. */
export function Correction(_props: { children?: ReactNode }) {
  return null;
}

export function Verification(_props: { children?: ReactNode }) {
  return null;
}
