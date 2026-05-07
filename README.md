# Mini Marketing MRI Quiz

Lead-magnet web app for **Davit Chkotua / Marketing Architect Studio**. Landing page → 7-question diagnostic quiz → lead capture → Supabase storage → automated diagnostic email via Resend → result page with CTAs to book a Marketing Architects Call or request a full Marketing MRI.

> Diagnostic-lite assessment only — explicitly **not** a full Marketing MRI.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres) for submission storage
- Resend for transactional email
- Zod for validation

## File structure

```
mini-marketing-mri/
├── src/
│   ├── app/
│   │   ├── api/quiz/submit/route.ts    # POST endpoint: validate → score → store → email
│   │   ├── quiz/page.tsx               # Multi-step quiz (client)
│   │   ├── result/[id]/page.tsx        # Server-rendered result page
│   │   ├── thank-you/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── ProgressBar.tsx
│   │   ├── QuizClient.tsx
│   │   └── ResultView.tsx
│   └── lib/
│       ├── analytics.ts                # Stub event tracker
│       ├── bottlenecks.ts              # Per-dimension diagnostic copy
│       ├── email.ts                    # Resend HTML/text email
│       ├── quiz-data.ts                # 7 questions in Georgian
│       ├── scoring.ts                  # Scoring + health level + recommendation
│       ├── supabase.ts                 # Server-side client factory
│       └── validation.ts               # Zod submission schema
├── supabase/migrations/0001_init.sql
├── .env.example
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # required — used by /api/quiz/submit
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL="Davit Chkotua <hello@your-verified-domain.com>"
BOOK_CALL_URL=https://your-cal-link
FULL_MRI_URL=https://your-mri-page
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Supabase

In the Supabase SQL editor, run the migration:

```bash
supabase/migrations/0001_init.sql
```

Or copy the SQL inline:

```sql
-- See supabase/migrations/0001_init.sql for full schema.
create table public.quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
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
  email_sent boolean default false,
  source text default 'mini_marketing_mri_quiz',
  utm_source text, utm_medium text, utm_campaign text,
  utm_content text, utm_term text
);
```

RLS is enabled and anon access is blocked. The API route writes/reads via the **service role key** server-side.

### 4. Resend

1. Create a Resend account, verify a sending domain.
2. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (must be from the verified domain).
3. In dev, you can send to your own address only until the domain is verified.

### 5. Run

```bash
npm run dev
# http://localhost:3000
```

## Deployment (Vercel)

1. Push to GitHub, import into Vercel.
2. Add all env vars from `.env.local` into the Vercel project settings.
3. Deploy. The API route runs on Node.js runtime (already configured).

## Scoring logic

- 7 dimensions × 0–4 each → max 28.
- Health levels:
  - 0–7 — Critical Leakage
  - 8–14 — Unstable Growth System
  - 15–21 — Partially Built Marketing Architecture
  - 22–28 — Strong Base, Needs Precision
- Primary bottleneck = lowest-scoring dimension. Ties broken in this order:
  Money Clarity → Offer Clarity → Funnel Visibility → Conversion Evidence →
  ICP Clarity → Execution Rhythm → Decision System.

## Analytics events (stubs)

`src/lib/analytics.ts` exposes a `track(event, payload)` helper that logs to console in dev. Replace the function body with your provider (PostHog, Plausible, GA4, etc.) when ready. Events emitted:

- `quiz_started`
- `quiz_step_completed`
- `quiz_submitted`
- `result_viewed`
- `call_cta_clicked`
- `mri_cta_clicked`

## Things to configure manually

- Supabase project + run migration
- Resend account + verified sending domain + `RESEND_FROM_EMAIL`
- `BOOK_CALL_URL` (Cal.com / Calendly / etc.)
- `FULL_MRI_URL` (landing page for the full Marketing MRI offer)
- Optional: hook a real analytics provider into `src/lib/analytics.ts`
- Optional: replace placeholder Google Fonts CDN import in `globals.css` with a self-hosted Noto Sans Georgian for production

## Assumptions

- Sending happens server-side in the `/api/quiz/submit` handler. If email fails, the submission is still stored (so no lead is lost) and `email_sent` stays `false` — you can retry from Supabase.
- The result page is publicly accessible by UUID — predictable enough for sharing, hard to enumerate. If you want stronger access control, add a short signed token to the URL.
- UTMs are read from query string on the quiz page and forwarded with the submission.
- Copy is locked in Georgian per brand canon. Code, types, and DB columns are in English.
