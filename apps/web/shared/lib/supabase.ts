import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let browserClient: SupabaseClient | null = null;

/** The signed-in admin's client in the browser. The anon key is public; access is enforced by the database rules. */
export function getBrowserSupabase(): SupabaseClient | null {
  if (!url || !anonKey) {
    return null;
  }
  browserClient ??= createClient(url, anonKey);
  return browserClient;
}

/** A short-lived client for server code, optionally acting as a signed-in user. */
export function createServerSupabase(accessToken?: string): SupabaseClient | null {
  if (!url || !anonKey) {
    return null;
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined
  });
}
