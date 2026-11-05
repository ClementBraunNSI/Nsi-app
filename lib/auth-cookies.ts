import type { CookieOptions } from '@supabase/ssr'

/**
 * Cookies de session Supabase (`sb-…-auth-token`, découpés en `.0`, `.1`… quand le jeton est long).
 * Supabase les garde 400 jours et ne laisse pas changer cette durée : on la réécrit à chaque dépôt.
 * Chaque rafraîchissement du jeton (au moins une fois par heure d'utilisation) repousse l'échéance,
 * la session ne tombe donc qu'après SESSION_DAYS jours sans visite.
 * HttpOnly est impossible ici : le client navigateur (lib/supabase.ts) lit lui-même la session.
 */
export const SESSION_DAYS = 30
const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60

export function authCookieOptions(options: CookieOptions | undefined, secure: boolean): CookieOptions {
  const maxAge = options?.maxAge === 0 ? 0 : Math.min(options?.maxAge ?? SESSION_MAX_AGE, SESSION_MAX_AGE)
  return { ...options, path: options?.path ?? '/', sameSite: 'lax', secure, maxAge }
}

/** Cookies lisibles par le navigateur, décodés comme le fait Supabase. */
export function readBrowserCookies() {
  if (typeof document === 'undefined') return []
  return document.cookie
    .split('; ')
    .filter(Boolean)
    .map((pair) => {
      const separator = pair.indexOf('=')
      const name = separator < 0 ? pair : pair.slice(0, separator)
      const value = separator < 0 ? '' : pair.slice(separator + 1)
      try {
        return { name, value: decodeURIComponent(value) }
      } catch {
        return { name, value }
      }
    })
}

export function writeBrowserCookie(name: string, value: string, options: CookieOptions | undefined) {
  if (typeof document === 'undefined') return
  const safe = authCookieOptions(options, window.location.protocol === 'https:')
  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${safe.path}`,
    `Max-Age=${safe.maxAge}`,
    'SameSite=Lax',
    ...(safe.secure ? ['Secure'] : []),
  ].join('; ')
}
