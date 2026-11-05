import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';
import { listSolvedCode } from '@/app/actions/solvedCode';
import { solvedCodeFiles } from '@/lib/solved-code';
import { buildZip } from '@/lib/zip';

export const dynamic = 'force-dynamic';

/** Codes réussis : un fichier texte par élève (?eleve=<id>), ou tous les élèves filtrés dans un zip. */
export async function GET(request: Request) {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return new NextResponse('Réservé aux enseignants.', { status: 403 });
  const params = new URL(request.url).searchParams;
  const pick = (name: string) => params.get(name)?.trim().slice(0, 200) || undefined;
  const filters = { classe: pick('classe'), courseId: pick('fiche'), studentId: pick('eleve') };

  const entries = await listSolvedCode(filters, true);
  if (entries.length === 0) return new NextResponse('Aucun code réussi pour ces filtres.', { status: 404 });
  const files = solvedCodeFiles(entries);

  if (filters.studentId) {
    return new NextResponse(files[0].content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${files[0].name}"`,
        'Cache-Control': 'no-store',
      },
    });
  }
  const base = ['codes_reussis', filters.classe, filters.courseId]
    .filter(Boolean)
    .map((part) => String(part).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, ''))
    .join('_');
  const zip = buildZip(files);
  return new NextResponse(new Blob([zip as BlobPart], { type: 'application/zip' }), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${base}.zip"`,
      'Cache-Control': 'no-store',
    },
  });
}
