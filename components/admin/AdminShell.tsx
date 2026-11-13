import type { ReactNode } from "react";
import { AdminNav, AdminSubnav, type AdminNavCounts } from "@/components/admin/AdminNav";
import { AdminClassProvider } from "@/components/admin/AdminClassContext";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

/**
 * Coque de l'admin : barre du haut (classe affichée, recherche, « Créer »), menu à cinq entrées,
 * onglets de l'entrée en cours et zone de contenu, aux couleurs du thème (clair et sombre).
 */
export function AdminShell({
  children,
  base,
  counts,
  classSelection = "",
  classes = [],
  hasPrivate = false,
}: {
  children: ReactNode;
  base?: string;
  counts?: AdminNavCounts;
  classSelection?: string;
  classes?: string[];
  hasPrivate?: boolean;
}) {
  return (
    <AdminClassProvider initial={classSelection} classes={classes} hasPrivate={hasPrivate}>
      <div className="admin-shell">
        <AdminTopbar base={base} />
        <div className="admin-shell-inner">
          <aside className="admin-side">
            <AdminNav base={base} counts={counts} />
          </aside>
          <div className="admin-main">
            <AdminSubnav base={base} />
            {children}
          </div>
        </div>
      </div>
    </AdminClassProvider>
  );
}
