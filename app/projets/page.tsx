import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Palette } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Projets | La tanière du code' },
  description: 'Découvrez les projets pédagogiques et créatifs de La tanière du code.',
};

const PROJECTS = [
  {
    id: 'chasse-aux-renards',
    title: "Chasse aux Ren'Arts",
    desc: "Une galerie de créations d'élèves qui revisitent les grands classiques de l'art avec la mascotte renard.",
    tag: 'Galerie artistique',
    href: '/projets/chasse-aux-renards',
    image: '/images/fox_chasse_renard.png',
    color: 'bg-rose-500',
    icon: Palette,
  },
];

export default function ProjetsPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#FDFCFB] font-sans selection:bg-orange-100 selection:text-orange-600">
      <main className="relative z-10 mx-auto max-w-7xl px-8 py-20">
        <header className="mb-14 max-w-3xl">
          <p className="mb-4 text-sm font-semibold text-orange-600">Projets pédagogiques</p>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 md:text-7xl">
            Les projets de la <span className="text-orange-500">tanière.</span>
          </h1>
          <p className="mt-6 text-lg font-medium leading-relaxed text-slate-500">
            Retrouvez ici les projets créatifs, expérimentaux ou pédagogiques menés autour du code,
            du numérique et de l'univers renard du site.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => {
            const Icon = project.icon;

            return (
              <Link key={project.id} href={project.href} className="group flex flex-col">
                <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_12px_30px_-20px_rgba(15,23,42,0.4)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_-22px_rgba(15,23,42,0.45)]">
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-orange-50 via-white to-rose-50 p-4">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-contain p-5 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute right-5 top-5 rounded-full border border-slate-100 bg-white px-3 py-1 text-[10px] font-bold tracking-tighter text-slate-800 shadow-sm">
                      {project.tag}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-8">
                    <div className="mb-4 flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${project.color} text-white shadow-lg transition-transform group-hover:rotate-12`}>
                        <Icon size={20} />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800 transition-colors group-hover:text-orange-500">
                        {project.title}
                      </h2>
                    </div>

                    <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-slate-500">
                      {project.desc}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                      <span className="text-xs font-bold text-slate-400">
                        Découvrir le projet
                      </span>
                      <div className={`${project.color} flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-transform group-hover:translate-x-1`}>
                        <ArrowRight size={22} />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}
