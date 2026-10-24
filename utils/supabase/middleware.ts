import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isAbortError } from '@/lib/is-abort-error'

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
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('must_change_password')
        .eq('id', user.id)
        .maybeSingle()
      const mustChange = Boolean(profile?.must_change_password)
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
