"use client";

import dynamic from "next/dynamic";
import { FoxHead } from "@/components/ui/FoxHead";

const FoxAcademy = dynamic(() => import("@/app/foxtest/academy/FoxAcademy"), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-[calc(100vh-5rem)] place-items-center bg-[var(--bg)]">
      <div className="flex items-center gap-3 text-sm font-semibold text-[var(--muted)]">
        <FoxHead size={28} />
        Le renard se prépare
      </div>
    </div>
  ),
});

export default function AcademiePage() {
  return <FoxAcademy />;
}
