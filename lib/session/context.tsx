"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { DEFAULT_SESSION, SessionData } from "@/lib/types";

const STORAGE_KEY = "myeongri-on-session";

interface SessionContextValue {
  session: SessionData;
  setSession: (updater: SessionData | ((prev: SessionData) => SessionData)) => void;
  clearSession: () => void;
  hydrated: boolean;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<SessionData>(DEFAULT_SESSION);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setSessionState(JSON.parse(raw) as SessionData);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session, hydrated]);

  const value = useMemo(
    () => ({
      session,
      hydrated,
      setSession: (updater: SessionData | ((prev: SessionData) => SessionData)) => {
        setSessionState((prev) => (typeof updater === "function" ? updater(prev) : updater));
      },
      clearSession: () => {
        sessionStorage.removeItem(STORAGE_KEY);
        setSessionState(DEFAULT_SESSION);
      },
    }),
    [session, hydrated],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
