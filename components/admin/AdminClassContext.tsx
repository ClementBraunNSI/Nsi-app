"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_CLASS_COOKIE, adminClassChoices, adminClassLabel, type AdminClassChoice } from "@/lib/admin-class";

type AdminClassValue = {
  /** "" = toutes les classes. */
  selection: string;
  label: string;
  choices: AdminClassChoice[];
  select: (value: string) => void;
};

const AdminClassContext = createContext<AdminClassValue>({ selection: "", label: adminClassLabel(""), choices: [], select: () => {} });

/** Classe choisie dans la barre du haut, partagée par toutes les pages de l'admin. */
export function AdminClassProvider({
  initial = "",
  classes = [],
  hasPrivate = false,
  children,
}: {
  initial?: string;
  classes?: string[];
  hasPrivate?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const [selection, setSelection] = useState(initial);

  const select = useCallback(
    (value: string) => {
      setSelection(value);
      // Cookie de session : il sert aux pages rendues sur le serveur (Aujourd'hui, Préparer…).
      document.cookie = `${ADMIN_CLASS_COOKIE}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
      router.refresh();
    },
    [router],
  );

  const value = useMemo(
    () => ({ selection, label: adminClassLabel(selection), choices: adminClassChoices(classes, hasPrivate), select }),
    [selection, classes, hasPrivate, select],
  );
  return <AdminClassContext.Provider value={value}>{children}</AdminClassContext.Provider>;
}

export function useAdminClass() {
  return useContext(AdminClassContext);
}
