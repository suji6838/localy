import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server Component/Route Handler에서 로그인한 사용자 세션을 읽기 위한 클라이언트.
// anon key + RLS로 동작하므로 auth.uid() 기준 정책이 걸린 테이블(locy_wellness_results 등)에 적합하다.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component에서 호출되면 set이 실패할 수 있음 — middleware가 세션 갱신을 담당하므로 무시해도 됨.
          }
        },
      },
    },
  );
}
