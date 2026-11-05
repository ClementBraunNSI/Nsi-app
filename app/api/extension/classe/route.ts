import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { bearerToken, parseClassInfo } from '@/lib/class-info';

/*
 * Lecture pour l'extension de navigateur « La tanière du code » : devoirs à faire, interros et DS à venir,
 * annonces non lues de la classe. L'extension envoie le jeton personnel de l'élève (Authorization: Bearer),
 * sans cookie ; extension_class_info ne rend que les données de la classe de l'élève à qui appartient le jeton.
 */

export const dynamic = 'force-dynamic';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization',
  'Cache-Control': 'no-store',
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(request: Request) {
  const token = bearerToken(request.headers.get('authorization'));
  if (!token) return NextResponse.json({ error: 'missing_token' }, { status: 401, headers: CORS });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: 'unavailable' }, { status: 503, headers: CORS });

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc('extension_class_info', { p_token: token });
  if (error) return NextResponse.json({ error: 'unavailable' }, { status: 503, headers: CORS });
  const info = parseClassInfo(data);
  if (!info) return NextResponse.json({ error: 'invalid_token' }, { status: 401, headers: CORS });
  return NextResponse.json(info, { headers: CORS });
}
