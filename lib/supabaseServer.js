import { createClient } from "@supabase/supabase-js";

// Server-only: never import this file from a "use client" component.
// The service role key bypasses RLS, so all writes must be validated here.
export function supabaseServer() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them in your Vercel project's Environment Variables."
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
