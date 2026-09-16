-- LOCALY 마켓플레이스 확장을 위한 신규 테이블.
-- 온담채가 쓰는 것과 같은 Supabase 프로젝트를 공유하되, 온담채 테이블(profiles, coach_checks)과
-- 섞이지 않도록 locy_ 접두사로 분리한다. auth.users(계정)는 두 서비스가 공유한다.

create table if not exists public.locy_partners (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references auth.users(id) on delete set null,
  type text not null,
  name text not null,
  category text not null,
  neighborhood text not null,
  intro text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  links text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.locy_partners enable row level security;
create policy "locy_partners_public_read_approved" on public.locy_partners
  for select using (status = 'approved');

create table if not exists public.locy_services (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.locy_partners(id) on delete cascade,
  category text not null,
  title text not null,
  description text not null,
  price_from integer not null,
  duration text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.locy_services enable row level security;
create policy "locy_services_public_read_approved" on public.locy_services
  for select using (status = 'approved');

create table if not exists public.locy_bookings (
  id uuid primary key default gen_random_uuid(),
  course_slug text,
  service_id uuid references public.locy_services(id) on delete set null,
  service_type text not null,
  neighborhood text not null,
  preferred_date text not null,
  preferred_time text not null,
  guest_name text not null,
  phone text not null,
  email text not null,
  notes text,
  matched_partner_ids uuid[],
  selected_partner_id uuid references public.locy_partners(id) on delete set null,
  status text not null default 'requested',
  created_at timestamptz not null default now()
);
alter table public.locy_bookings enable row level security;
-- 예약은 개인정보(연락처)를 포함하므로 공개 read 정책을 두지 않는다 — service role(서버 API 라우트)만 접근.

create table if not exists public.locy_inquiries (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.locy_partners(id) on delete cascade,
  service_id uuid references public.locy_services(id) on delete set null,
  guest_name text not null,
  phone text not null,
  email text not null,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
alter table public.locy_inquiries enable row level security;

create table if not exists public.locy_reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.locy_bookings(id) on delete cascade,
  partner_id uuid not null references public.locy_partners(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);
alter table public.locy_reviews enable row level security;
create policy "locy_reviews_public_read" on public.locy_reviews
  for select using (true);

create table if not exists public.locy_reports (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('partner', 'review')),
  target_id uuid not null,
  reason text not null,
  reporter_email text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
alter table public.locy_reports enable row level security;

-- 8체질 진단 결과. 온담채의 profiles 테이블과 구조는 비슷하지만 별개 테이블로 둔다
-- (두 서비스가 같은 계정을 공유하더라도 서로 다른 앱의 데이터 변경에 영향받지 않도록).
create table if not exists public.locy_wellness_results (
  user_id uuid primary key references auth.users(id) on delete cascade,
  answers jsonb not null default '[]'::jsonb,
  constitution text,
  updated_at timestamptz not null default now()
);
alter table public.locy_wellness_results enable row level security;
create policy "locy_wellness_results_select_own" on public.locy_wellness_results
  for select using (auth.uid() = user_id);
create policy "locy_wellness_results_insert_own" on public.locy_wellness_results
  for insert with check (auth.uid() = user_id);
create policy "locy_wellness_results_update_own" on public.locy_wellness_results
  for update using (auth.uid() = user_id);
