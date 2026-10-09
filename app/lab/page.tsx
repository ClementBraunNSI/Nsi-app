import { redirect } from 'next/navigation';
import { getAuthContext } from '@/lib/auth';

export default async function LabPage() {
  const auth = await getAuthContext();
  if (!auth.user) redirect('/connexion?next=%2Flab');
  if (auth.isElevated) redirect('/admin');
  redirect('/espace');
}
