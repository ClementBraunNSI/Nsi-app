"use client";
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle, 
  ArrowUpRight, 
  Clock, 
  Search 
} from 'lucide-react';

// Simulation de données pour l'interface
const STATS = [
  { label: "Élèves actifs", value: "12", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Exercices complétés", value: "148", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Badges décernés", value: "32", icon: Award, color: "text-orange-600", bg: "bg-orange-50" },
];

const STUDENTS_DATA = [
  { id: 1, name: "Alice Martin", level: "Première NSI", progress: 85, lastActivity: "Boucles While", status: "online" },
  { id: 2, name: "Thomas Durand", level: "Terminale NSI", progress: 42, lastActivity: "Récursivité", status: "offline" },
  { id: 3, name: "Julie Lefebvre", level: "SNT", progress: 92, lastActivity: "HTML/CSS", status: "online" },
  { id: 4, name: "Lucas Morel", level: "Première NSI", progress: 15, lastActivity: "Variables", status: "offline" },
];

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      {/* HEADER DU DASHBOARD */}
      <div className="bg-white border-b border-slate-100 mb-8">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                Console <span className="text-orange-500">Enseignant</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1">Gérez vos élèves et suivez leur progression en temps réel.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2">
                Nouvel Élève +
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8">
        {/* GRILLE DE STATISTIQUES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
              <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                <stat.icon className={stat.color} size={32} />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION ÉLÈVES */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              Suivi des Étudiants
              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] rounded-full uppercase">Live</span>
            </h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un élève..."
                className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Étudiant</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Niveau</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Progression globale</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Dernier Exercice</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {STUDENTS_DATA.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((student) => (
                  <tr key={student.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                            {student.name.charAt(0)}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full ${student.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        </div>
                        <span className="font-bold text-slate-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-500">{student.level}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className="bg-orange-500 h-full rounded-full" 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-black text-slate-700">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm text-slate-500 italic">
                        <Clock size={14} className="text-slate-300" />
                        {student.lastActivity}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-300 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                        <ArrowUpRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-slate-50/30 border-t border-slate-50 text-center">
            <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors">
              Voir tous les élèves
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}