"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const REFRESH = 30_000;

/**
 * Pastille du lien « Évaluations » : évaluations à faire pour un élève de classe,
 * copies verrouillées qui attendent l'enseignant pour un compte admin ou enseignant.
 */
export function usePendingEvaluations(enabled: boolean, pathname: string) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase.rpc("eval_pending_count");
      if (!cancelled && !error) setCount(Number(data) || 0);
    };
    void load();
    const timer = window.setInterval(load, REFRESH);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [enabled, pathname]);

  return count;
}
