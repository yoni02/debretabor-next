import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Use in Server Components, Route Handlers, and middleware */
export function createSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(list) { list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); },
    },
  });
}

/** Service-role admin client — bypasses RLS, server only */
export function createSupabaseAdmin() {
  return createServerClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: { getAll: () => [], setAll: () => {} },
    auth:    { persistSession: false },
  });
}
