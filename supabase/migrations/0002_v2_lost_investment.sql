-- Mini Marketing MRI v2 — lost investment / visibility / readiness scores
-- Additive migration: keeps old columns alive (nullable) and adds new v2 fields.

-- 1. Drop NOT NULL on legacy columns so old code paths still work but are no longer required.
alter table public.quiz_submissions
  alter column company drop not null,
  alter column role drop not null,
  alter column dimension_scores drop not null,
  alter column total_score drop not null,
  alter column percentage drop not null,
  alter column health_level drop not null,
  alter column primary_bottleneck drop not null,
  alter column result_summary drop not null;

-- 2. Add v2 context fields.
alter table public.quiz_submissions
  add column if not exists business_type text,
  add column if not exists sales_method text,
  add column if not exists monthly_potential_customers text,
  add column if not exists average_sale_value text;

-- 3. Add v2 score fields.
alter table public.quiz_submissions
  add column if not exists lost_investment_risk_score int,
  add column if not exists problem_visibility_score int,
  add column if not exists mri_readiness_score int,
  add column if not exists risk_label text,
  add column if not exists visibility_label text,
  add column if not exists readiness_label text,
  add column if not exists suspected_loss_point text;

-- 4. Useful indexes.
create index if not exists quiz_submissions_loss_point_idx
  on public.quiz_submissions (suspected_loss_point);
