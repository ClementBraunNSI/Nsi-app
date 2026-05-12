"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function useAuthSession() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadRole = async (userId: string) => {
      const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
      setRole(data?.role ?? null);
      return data?.role ?? null;
    };

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) await loadRole(session.user.id);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" && session) {
        const nextRole = await loadRole(session.user.id);
        router.push(nextRole === "admin" ? "/admin/dashboard" : "/student/dashboard");
      }
      if (event === "SIGNED_OUT") {
        setRole(null);
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, role, signIn, signOut };
}
