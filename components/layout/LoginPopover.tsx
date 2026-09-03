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
    <div className="absolute right-0 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow)] p-6 z-[120] top-16">
      <div className="flex justify-between items-center mb-4 text-xs font-semibold text-[var(--subtle)]">
        <span>Identification</span>
        <button onClick={onClose} className="hover:text-[var(--accent)]">
          <X size={16} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--accent)] transition-colors"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--accent)] transition-colors"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full py-3 bg-[var(--accent)] text-[var(--accent-fg)] rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
          Se connecter
        </button>
      </form>
    </div>
  );
}
