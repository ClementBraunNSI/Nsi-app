import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/*
 * Envois de la page d'évaluation qui ne passent pas par une action serveur :
 * - « fermeture », envoyé par navigator.sendBeacon quand la page se ferme ;
 * - « capture », la capture d'écran jointe à un incident (trop lourde pour une action serveur).
 * La session de l'élève suffit : les fonctions eval_* vérifient que la copie est la sienne.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BODY = 1_600_000;

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > MAX_BODY) return NextResponse.json({ ok: false }, { status: 413 });
  let body: { type?: string; attemptId?: string; incidentId?: number; image?: string };
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = await createClient();
  if (body.type === 'fermeture' && body.attemptId && UUID.test(body.attemptId)) {
    const { error } = await supabase.rpc('eval_report_incident', { p_attempt: body.attemptId, p_kind: 'fermeture', p_detail: '' });
    return NextResponse.json({ ok: !error });
  }
  if (body.type === 'capture' && Number.isSafeInteger(body.incidentId) && typeof body.image === 'string') {
    const { data, error } = await supabase.rpc('eval_attach_screenshot', { p_incident: body.incidentId, p_image: body.image });
    return NextResponse.json({ ok: !error && data === true });
  }
  return NextResponse.json({ ok: false }, { status: 400 });
}
