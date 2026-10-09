// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'
import { isAbortError } from '@/lib/is-abort-error'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Le verrou navigateur annule l’autre appel avec « signal is aborted without reason »
    // dès que l’en-tête et une page lisent la session en même temps.
    lock: async <T>(_name: string, _acquireTimeout: number, fn: () => Promise<T>) => fn(),
  },
  global: {
    fetch: async (input, init) => {
      try {
        return await fetch(input, init);
      } catch (error) {
        if (!isAbortError(error)) throw error;
        return new Response(JSON.stringify({ error: 'aborted' }), {
          status: 499,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    },
  },
})