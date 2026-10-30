import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isAbortError } from '@/lib/is-abort-error'

// Compte sans mot de passe à changer : la réponse est gardée 10 minutes dans un cookie signé par le serveur,
// pour ne pas relire le profil à chaque page. Un compte qui doit changer son mot de passe est revérifié à chaque fois.
// Sans clé serveur pour signer (développement), rien n'est gardé : le profil est relu comme avant.
const PASSWORD_OK_COOKIE = 'nsi-mdp-ok'
const PASSWORD_OK_SECONDS = 600

let signingKey: Promise<CryptoKey> | null = null

function passwordOkKey() {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret) return null
  signingKey ??= crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return signingKey
}

async function passwordOkSignature(userId: string, expires: number) {
  const key = passwordOkKey()
  if (!key) return null
  const signature = await crypto.subtle.sign('HMAC', await key, new TextEncoder().encode(`${PASSWORD_OK_COOKIE}:${userId}:${expires}`))
  return btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Cookie « mot de passe déjà changé » encore valable pour cet utilisateur, et bien signé par le serveur. */
async function passwordKnownOk(value: string | undefined, userId: string) {
  const [owner, expiresText, signature] = (value ?? '').split('.')
  const expires = Number(expiresText)
  if (owner !== userId || !Number.isFinite(expires) || expires < Date.now() || !signature) return false
  return signature === (await passwordOkSignature(userId, expires))
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Vérification basique des variables d'environnement
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      global: {
        fetch: async (url, options) => {
          try {
            return await fetch(url, options);
          } catch (error) {
            if (isAbortError(error)) throw error;
            console.warn('Supabase fetch failed in middleware:', error instanceof Error ? error.message : 'network');
            return new Response(JSON.stringify({ error: 'Network error' }), {
              status: 502,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    // getClaims vérifie le jeton sur place quand le projet signe avec ses clés publiques ; sinon il interroge Supabase
    // comme getUser. Dans les deux cas la session expirée est rafraîchie et les cookies mis à jour.
    const { data } = await supabase.auth.getClaims()
    const userId = typeof data?.claims?.sub === 'string' ? data.claims.sub : null
    if (userId) {
      const knownOk = await passwordKnownOk(request.cookies.get(PASSWORD_OK_COOKIE)?.value, userId)
      let mustChange = false
      if (!knownOk) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('must_change_password')
          .eq('id', userId)
          .maybeSingle()
        mustChange = Boolean(profile?.must_change_password)
        const expires = Date.now() + PASSWORD_OK_SECONDS * 1000
        const signature = mustChange ? null : await passwordOkSignature(userId, expires)
        if (signature) {
          response.cookies.set(PASSWORD_OK_COOKIE, `${userId}.${expires}.${signature}`, {
            httpOnly: true,
            sameSite: 'lax',
            secure: request.nextUrl.protocol === 'https:',
            path: '/',
            maxAge: PASSWORD_OK_SECONDS,
          })
        }
      }
      const path = request.nextUrl.pathname
      const target = mustChange && path !== '/mot-de-passe'
        ? '/mot-de-passe'
        : !mustChange && path === '/mot-de-passe'
          ? '/espace'
          : null
      if (target) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = target
        redirectUrl.search = ''
        const redirectResponse = NextResponse.redirect(redirectUrl)
        response.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie)
        })
        return redirectResponse
      }
    }
  } catch (error) {
    if (isAbortError(error)) return response
    console.error("Middleware Auth Error:", error)
  }

  return response
}
