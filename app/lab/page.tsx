import { redirect } from 'next/navigation';
import { getAuthContext } from '@/lib/auth';
import { labPageTarget } from '@/lib/exercise-type';

export default async function LabPage() {
  const auth = await getAuthContext();
  redirect(labPageTarget({ signedIn: Boolean(auth.user), elevated: auth.isElevated }));
}
