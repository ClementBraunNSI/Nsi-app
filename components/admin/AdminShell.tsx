import type { ReactNode } from "react";
import { AdminNav, type AdminNavCounts } from "@/components/admin/AdminNav";

/** Coque de l'admin : menu groupé et zone de contenu, aux couleurs du thème (clair et sombre). */
export function AdminShell({ children, base, counts }: { children: ReactNode; base?: string; counts?: AdminNavCounts }) {
  return (
    <div className="admin-shell">
      <div className="admin-shell-inner">
        <aside className="admin-side">
          <AdminNav base={base} counts={counts} />
        </aside>
        <div className="admin-main">{children}</div>
      </div>
    </div>
  );
}
