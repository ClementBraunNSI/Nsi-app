import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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
            console.warn('Supabase fetch failed in middleware:', error);
            // On retourne une réponse d'erreur HTTP classique au lieu de laisser crash le runtime
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
    await supabase.auth.getUser()
  } catch (error) {
    // Si l'URL Supabase n'est pas définie ou accessible (ex: build time), on ignore l'erreur
    console.error("Middleware Auth Error:", error)
  }

  return response
}
