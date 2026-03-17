import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      global: {
        fetch: async (url, options) => {
          try {
            return await fetch(url, options);
          } catch (error) {
            console.warn('Supabase fetch failed in server.ts:', error);
            return new Response(JSON.stringify({ error: 'Network error' }), {
              status: 502,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Cette erreur peut être ignorée si vous êtes dans un Server Component
            // (les Server Components ne peuvent pas écrire de cookies, seul le Middleware le peut)
          }
        },
      },
    }
  );
}