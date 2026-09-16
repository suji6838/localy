import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// RLS를 우회하는 서버 전용 클라이언트. Route Handler 안에서만 사용하고
// 절대 클라이언트 번들에 노출하지 말 것 (SUPABASE_SERVICE_ROLE_KEY는 비밀값).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
