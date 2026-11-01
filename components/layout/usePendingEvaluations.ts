"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const REFRESH = 30_000;

/**
 * Pastille du lien « Évaluations » : évaluations à faire pour un élève de classe,
 * copies verrouillées qui attendent l'enseignant pour un compte admin ou enseignant.
 */
export function usePendingEvaluations(enabled: boolean, pathname: string) {
  return usePendingCount("eval_pending_count", enabled, pathname);
}

/** Pastille du lien « Défi » : défi du lundi ouvert et pas encore réussi. */
export function usePendingChallenge(enabled: boolean, pathname: string) {
  return usePendingCount("challenge_pending_count", enabled, pathname);
}

function usePendingCount(rpc: "eval_pending_count" | "challenge_pending_count", enabled: boolean, pathname: string) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase.rpc(rpc);
      if (!cancelled && !error) setCount(Number(data) || 0);
    };
    void load();
    const timer = window.setInterval(load, REFRESH);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [enabled, pathname, rpc]);

  return count;
}
