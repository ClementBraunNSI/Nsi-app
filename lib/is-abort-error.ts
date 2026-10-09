/** Annulation de navigation ou de verrou d’auth, pas une panne réseau. */
export function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { name?: string; message?: string; cause?: unknown };
  if (err.name === "AbortError") return true;
  const message = typeof err.message === "string" ? err.message : "";
  if (message === "signal is aborted without reason" || message === "This operation was aborted") {
    return true;
  }
  return err.cause ? isAbortError(err.cause) : false;
}
