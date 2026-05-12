"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import SiteHeader from "./SiteHeader";
import { FoxEasterEggProvider } from "./FoxEasterEggProvider";
import { useAuthSession } from "./useAuthSession";

const CommandPalette = dynamic(() => import("@/components/experimental/CommandPalette"), {
  ssr: false,
  loading: () => null,
});

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const [dyslexicMode, setDyslexicMode] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const { user, role, signIn, signOut } = useAuthSession();

  useEffect(() => {
    const savedDyslexic = localStorage.getItem("dyslexicMode") === "true";
    const savedHighContrast = localStorage.getItem("highContrastMode") === "true";
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDyslexicMode(savedDyslexic);
    setHighContrastMode(savedHighContrast);
    setDarkMode(savedDarkMode);
    if (savedDyslexic) document.documentElement.classList.add("dyslexic");
    if (savedHighContrast) document.documentElement.classList.add("high-contrast");
    if (savedDarkMode) document.documentElement.classList.add("dark");
  }, []);

  const toggleClass = (className: string, key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    localStorage.setItem(key, String(value));
    if (value) document.documentElement.classList.add(className);
    else document.documentElement.classList.remove(className);
  };

  return (
    <FoxEasterEggProvider>
      <SiteHeader
        pathname={pathname}
        user={user}
        role={role}
        signIn={signIn}
        signOut={signOut}
        dyslexicMode={dyslexicMode}
        darkMode={darkMode}
        highContrastMode={highContrastMode}
        toggleClass={toggleClass}
        setDyslexicMode={setDyslexicMode}
        setDarkMode={setDarkMode}
        setHighContrastMode={setHighContrastMode}
      />
      <CommandPalette />
      <main>{children}</main>
    </FoxEasterEggProvider>
  );
}

