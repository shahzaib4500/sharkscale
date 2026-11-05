"use client";
import { blogAdminApi } from "@features/blog/api/blogAdminApi";
import { getBrowserSupabase, isSupabaseConfigured } from "@shared/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export type AdminSessionStatus = "unconfigured" | "loading" | "signed-out" | "denied" | "error" | "admin";

/**
 * Tracks who is signed in and whether they can manage the SharkScale blog.
 * This only decides what to show. The database rules are what actually protect the data.
 */
export function useAdminSession(): AdminSessionStatus {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [access, setAccess] = useState<{ userId: string | null; status: AdminSessionStatus }>({ userId: null, status: "loading" });
  const userId = session?.user.id ?? null;

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) {
      return undefined;
    }
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) {
          setSession(data.session);
        }
      })
      .catch(() => {
        if (active) {
          setSession(null);
        }
      });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
      }
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }
    let active = true;
    blogAdminApi
      .isAdmin(userId)
      .then((isAdmin) => {
        if (active) {
          setAccess({ userId, status: isAdmin ? "admin" : "denied" });
        }
      })
      .catch(() => {
        if (active) {
          setAccess({ userId, status: "error" });
        }
      });
    return () => {
      active = false;
    };
  }, [userId]);

  if (!isSupabaseConfigured) {
    return "unconfigured";
  }
  if (session === undefined) {
    return "loading";
  }
  if (!session) {
    return "signed-out";
  }
  return access.userId === userId ? access.status : "loading";
}
