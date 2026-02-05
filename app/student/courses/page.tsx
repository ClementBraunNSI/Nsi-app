import { createClient } from '@/utils/supabase/server';
import { getReservedCourses } from '@/app/actions/getReservedCourses';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BookOpen, Lock, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/student/dashboard"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Mes Cours Particuliers
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Retrouvez ici tous vos cours et exercices réservés.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Lock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun cours disponible</h3>
            <p className="mt-1 text-sm text-gray-500">
              Vous n'avez pas encore accès à des cours particuliers.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link 
                key={course.path} 
                href={course.path}
                className="block group h-full"
              >
                <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                        <BookOpen className="h-6 w-6 text-indigo-600" />
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Privé
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span className="capitalize">Niveau: {course.level.replace('particuliers', 'Cours Particulier')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
