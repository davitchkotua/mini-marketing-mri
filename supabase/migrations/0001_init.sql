-- Mini Marketing MRI — quiz_submissions table
create extension if not exists "pgcrypto";

create table if not exists public.quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text not null,
  role text not null,
  website text,
  revenue_range text,
  team_size text,
  answers jsonb not null,
  dimension_scores jsonb not null,
  total_score int not null,
  percentage int not null,
  health_level text not null,
  primary_bottleneck text not null,
  result_summary jsonb not null,
  email_sent boolean not null default false,
  source text not null default 'mini_marketing_mri_quiz',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text
);

create index if not exists quiz_submissions_created_at_idx
  on public.quiz_submissions (created_at desc);
create index if not exists quiz_submissions_email_idx
  on public.quiz_submissions (email);

-- Row Level Security: writes/reads happen via the service role key from the server.
alter table public.quiz_submissions enable row level security;

-- Block anon entirely; the API route uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS.
drop policy if exists "no anon access" on public.quiz_submissions;
create policy "no anon access"
  on public.quiz_submissions
  for all
  to anon
  using (false)
  with check (false);
