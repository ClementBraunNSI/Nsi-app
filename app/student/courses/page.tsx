import { createClient } from '@/utils/supabase/server';
import { getReservedCourses } from '@/app/actions/getReservedCourses';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BookOpen, Lock, ArrowLeft } from 'lucide-react';
import { Badge, Card, EmptyState, PageHeader } from '@/components/ui';

export default async function StudentCoursesPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', session.user.id)
    .single();

  const courses = await getReservedCourses(profile?.full_name || '');

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/student/dashboard"
            className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </div>

        <PageHeader
          className="mb-12"
          eyebrow="Espace élève"
          title="Mes Cours Particuliers"
          description="Retrouvez ici tous vos cours et exercices réservés."
        />

        {courses.length === 0 ? (
          <EmptyState
            icon={<Lock className="h-8 w-8" />}
            title="Aucun cours disponible"
            description="Vous n'avez pas encore accès à des cours particuliers."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link 
                key={course.path} 
                href={course.path}
                className="block group h-full"
              >
                <Card className="overflow-hidden hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 h-full flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                        <BookOpen className="h-6 w-6 text-orange-600" />
                      </div>
                      <Badge tone="orange">Privé</Badge>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="mt-4 flex items-center text-sm text-slate-500">
                      <span className="capitalize">Niveau: {course.level.replace('particuliers', 'Cours Particulier')}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
