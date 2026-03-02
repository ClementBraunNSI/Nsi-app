'use client';

import React, { useState } from 'react';
import { Smartphone, Truck, Globe, Router, EthernetPort, Mail, Monitor, Search, Lock } from 'lucide-react';

export default function TcpIpLayers() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const layers = [
    {
      id: 4,
      name: "Application",
      color: "bg-slate-800",
      lightColor: "bg-slate-100",
      textColor: "text-slate-800",
      icon: <Smartphone className="w-8 h-8 text-white" />,
      role: "L'interface avec l'utilisateur",
      description: "C'est la couche que vous voyez ! Elle permet aux applications (Navigateur, Email, Jeux) de communiquer.",
      analogy: "✍️ Écrire la lettre",
      analogyDetail: "Vous rédigez le contenu de votre message. Peu importe comment il sera transporté, l'important c'est ce qu'il y a écrit.",
      protocols: ["HTTP (Web)", "SMTP (Email)", "FTP (Fichiers)"]
    },
    {
      id: 3,
      name: "Transport (TCP)",
      color: "bg-slate-600",
      lightColor: "bg-slate-50",
      textColor: "text-slate-600",
      icon: <Truck className="w-8 h-8 text-white" />,
      role: "La fiabilité et le découpage",
      description: "Découpe le message en petits morceaux (segments) et s'assure qu'ils arrivent tous à bon port. Si un morceau manque, il est redemandé.",
      analogy: "✉️ Mettre dans l'enveloppe (Recommandé)",
      analogyDetail: "On met la lettre dans une enveloppe sécurisée. On s'assure qu'elle est bien fermée et on demande un accusé de réception.",
      protocols: ["TCP (Fiable)", "UDP (Rapide)"]
    },
    {
      id: 2,
      name: "Internet (IP)",
      color: "bg-orange-600",
      lightColor: "bg-orange-100",
      textColor: "text-orange-700",
      icon: <Globe className="w-8 h-8 text-white" />,
      role: "L'adressage et le routage",
      description: "Ajoute l'adresse de l'expéditeur et du destinataire (IP). Trouve le meilleur chemin à travers le réseau mondial.",
      analogy: "📮 L'adresse et le Centre de Tri",
      analogyDetail: "On écrit l'adresse du destinataire sur l'enveloppe. La poste (les routeurs) décide par quel camion/train elle doit passer.",
      protocols: ["IPv4", "IPv6"]
    },
    {
      id: 1,
      name: "Accès Réseau",
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      textColor: "text-orange-600",
      icon: <EthernetPort className="w-8 h-8 text-white" />,
      role: "Le transport physique",
      description: "Transforme les données numériques (0 et 1) en signaux physiques (électricité, lumière, ondes) pour voyager sur les câbles.",
      analogy: "🚚 Le Camion / L'Avion",
      analogyDetail: "C'est le véhicule physique qui transporte le courrier. Ça peut être un vélo, un camion ou un avion, le courrier reste le même.",
      protocols: ["Ethernet (Câble)", "Wi-Fi (Ondes)", "Fibre (Lumière)"]
    }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 my-8 items-start">
      {/* Stack Visualizer */}
      <div className="flex flex-col w-full md:w-1/3 gap-2">
        <h3 className="text-center font-bold text-slate-700 mb-2 uppercase tracking-widest text-sm">Modèle TCP/IP</h3>
        {layers.map((layer) => (
          <div
            key={layer.id}
            onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
            className={`
              relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 shadow-sm
              ${activeLayer === layer.id 
                ? `${layer.color} border-transparent scale-105 shadow-lg` 
                : 'bg-white border-slate-100 hover:border-slate-300'
              }
            `}
          >
            <div className={`p-2 rounded-lg mr-4 ${activeLayer === layer.id ? 'bg-white/20' : layer.color}`}>
              {layer.icon}
            </div>
            <div>
              <div className={`font-black text-lg ${activeLayer === layer.id ? 'text-white' : 'text-slate-800'}`}>
                {layer.name}
              </div>
              <div className={`text-xs font-medium uppercase tracking-wider ${activeLayer === layer.id ? 'text-white/80' : 'text-slate-400'}`}>
                Couche {layer.id}
              </div>
            </div>
            
            {/* Arrow indicator */}
            {activeLayer === layer.id && (
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 border-l-8 border-t-8 border-b-8 border-l-current border-t-transparent border-b-transparent text-current" style={{ color: 'inherit' }} />
            )}
          </div>
        ))}
      </div>

      {/* Info Panel */}
      <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200 p-6 min-h-[400px] shadow-lg relative overflow-hidden">
        {activeLayer ? (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            {layers.map((layer) => {
              if (layer.id !== activeLayer) return null;
              return (
                <div key={layer.id}>
                  <div className={`inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 ${layer.lightColor} ${layer.textColor}`}>
                    Couche {layer.name}
                  </div>
                  
                  <h2 className="text-2xl font-black text-slate-800 mb-2">{layer.role}</h2>
                  <p className="text-slate-600 text-lg leading-relaxed mb-8">{layer.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span className="text-xl">💡</span> Analogie Postale
                      </h4>
                      <div className="font-bold text-slate-700 mb-1">{layer.analogy}</div>
                      <p className="text-sm text-slate-500">{layer.analogyDetail}</p>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span className="text-xl">🛠️</span> Protocoles & Exemples
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {layer.protocols.map((proto, i) => (
                          <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-600 shadow-sm">
                            {proto}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center opacity-60">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <span className="text-4xl">👆</span>
            </div>
            <p className="text-lg font-medium">Cliquez sur une couche<br/>pour découvrir ses secrets !</p>
          </div>
        )}
      </div>
    </div>
  );
}
