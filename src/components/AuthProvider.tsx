"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "@/components/AuthModal";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  supabase: SupabaseClient;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        supabase,
        openAuthModal: () => setModalOpen(true),
        closeAuthModal: () => setModalOpen(false),
        signOut: async () => {
          await supabase.auth.signOut();
        },
      }}
    >
      {children}
      {modalOpen && <AuthModal />}
    </AuthContext.Provider>
  );
}
