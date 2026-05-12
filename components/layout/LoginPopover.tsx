"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<{ message: string } | null>;
};

export default function LoginPopover({ onClose, onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const error = await onLogin(email, password);
    if (error) alert("Erreur : " + error.message);
    else onClose();
  };

  return (
    <div className="absolute right-0 w-72 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl p-6 z-[120] top-16">
      <div className="flex justify-between items-center mb-4 text-[10px] font-black uppercase text-slate-400">
        <span>Identification</span>
        <button onClick={onClose} className="hover:text-orange-500">
          <X size={16} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-orange-500 transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-orange-500 transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full py-3 bg-orange-500 text-white rounded-xl text-xs font-black uppercase hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all">
          Se connecter
        </button>
      </form>
    </div>
  );
}
