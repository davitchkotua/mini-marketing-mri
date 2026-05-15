# Mini Marketing MRI — Project Handoff & AI Agent Guide

> **Purpose of this file:** Complete context for any AI coding agent (ChatGPT Codex, Claude, Cursor, etc.) or new engineer picking up this project. Read this first before making any changes.
>
> **Language convention:** Product copy is **Georgian (ka)**. Code, comments, and internal labels are **English**. Do not translate UI text without explicit instruction — copy is locked brand canon.
>
> **Last updated:** v2.2 (post-launch — randomized options, expanded sale ranges, dark-mode email, thank-you page redesign)

---

## 1. Product Overview

**Mini Marketing MRI** is a 16-question diagnostic quiz that helps Georgian SMBs identify where their marketing investment is leaking before sale.

It's a **lead-generation tool** for the Marketing Architect Studio (Davit Chkotua's consulting practice). The full paid product is the "Marketing MRI" — this mini version is a free intake that drives qualified booking calls.

### Business model
- Visitor lands on `/` → takes quiz → result is emailed (not shown on screen) → CTA in email books a diagnostic call → call may lead to full Marketing MRI engagement.
- Admin (`hello@davitchkotua.com`) gets a notification email with every submission (contact info + all 16 answers).

### Brand positioning (locked)
- **Hero line:** "სად იკარგება მარკეტინგში ჩადებული შენი ინვესტიცია?"
- **Subhead:** "5-წუთიანი Mini Marketing MRI — სად კარგავს შენი ბიზნესი გაყიდვებს, ბიუჯეტს ან ზრდის შანსს."
- **Tone:** diagnostic, not aggressive. Show signals, not verdicts. Never promise specific financial outcomes.
- **Always disclose:** "ეს არ არის სრული Marketing MRI — ეს საწყისი დიაგნოსტიკაა."

### Brand colors
- Background: `#170303` (deep maroon-black)
- Card surface: `#1f0404` (slightly lighter)
- Border: `#3a1010` / `border-line` Tailwind class
- Accent (CTA, highlights): `#FFB21A` (warm yellow)
- Body text: `#FFFFFF`
- Soft text: `#D4C4C4` / `text-ink-soft`
- Muted text: `#9a8a8a` / `text-ink-muted`

---

## 2. Tech Stack

| Layer | Tech |
|-------|------|
| Framework | **Next.js 14** (App Router) + **TypeScript** |
| Styling | **Tailwind CSS** (custom dark theme) |
| Forms / validation | **Zod** |
| Database | **Supabase** (PostgreSQL) |
| Email | **Resend** SDK |
| Hosting | **Vercel** (auto-deploy from `main` branch) |
| Repo | GitHub: `davitchkotua/mini-marketing-mri` |

### Live URLs
- **Production:** https://quiz.davitchkotua.com
- **Supabase project:** `shvzebnvqcqyvcddruki`
- **Owner site (CTA target):** https://www.davitchkotua.com

---

## 3. Environment Variables

Required in **Vercel project settings** and local `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://shvzebnvqcqyvcddruki.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # server-only — bypasses RLS
RESEND_API_KEY=<resend key>
RESEND_FROM_EMAIL="Davit Chkotua <hello@davitchkotua.com>"
BOOK_CALL_URL=https://www.davitchkotua.com/#book-call
```

**⚠️ Never commit `.env*` files. Never paste secrets into chat / Codex prompts.**

---

## 4. File Structure (annotated)

```
mini-marketing-mri/
├── HANDOFF.md                       ← THIS FILE
├── package.json                     ← Next 14, React, Zod, Resend, Supabase
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
│
├── src/
│   ├── app/
│   │   ├── layout.tsx               Root layout — header (Marketing Architect Studio brand) + footer
│   │   ├── page.tsx                 Landing page (/) — hero, symptoms, 7 dimensions, outcomes, CTAs
│   │   ├── globals.css              Tailwind + custom utilities (.card, .btn-primary, .btn-ghost, .field, .label, .err)
│   │   ├── quiz/page.tsx            Wraps <QuizClient/>
│   │   ├── result/[id]/page.tsx     Thank-you page (server component) — fetches submission, renders confirmation only
│   │   └── api/quiz/submit/route.ts POST endpoint — Zod validate → computeScore → Supabase insert → 2 emails → return {id}
│   │
│   ├── components/
│   │   ├── QuizClient.tsx           Main quiz UI — 16 questions, multi-select, randomization, lead form, submit
│   │   ├── ResultView.tsx           LEGACY — full-scores view; no longer used after v2.2 (kept in repo, dead code)
│   │   └── ProgressBar.tsx          Yellow accent progress bar
│   │
│   └── lib/
│       ├── quiz-data.ts             16 questions + QuizQuestion / QuizOption / SuspectedLossPoint types
│       ├── scoring.ts               computeScore(answers) → 3 scores + labels + explanations + primary loss point
│       ├── bottlenecks.ts           Full diagnostic copy for 7 loss points (title, diagnosis, meanings, checks, 7-day action)
│       ├── validation.ts            Zod submissionSchema (name/email/phone/company/consent/answers/utm)
│       ├── email.ts                 sendDiagnosticEmail() to user + sendAdminNotification() to hello@
│       ├── supabase.ts              getServerSupabase() — service-role client
│       └── analytics.ts             track(event, props) — Plausible/gtag wrapper
│
└── supabase/
    └── migrations/
        ├── 0001_init.sql            Original v1 schema (legacy)
        ├── 0002_v2_lost_investment.sql  v2 columns (scores, labels, suspected_loss_point, business_type, etc.)
        └── 0003_v2_1_multi_select.sql   v2.1 columns (phone, sales_methods, primary_sales_method, suspected_loss_points, primary_suspected_loss_point)
```

---

## 5. Database Schema (`quiz_submissions` table)

> Supabase project: `shvzebnvqcqyvcddruki`. RLS is enabled — only the **service role key** can read/write. Anon role is fully blocked.

### Active columns (v2.2)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | `gen_random_uuid()` |
| `created_at` | timestamptz | `now()` default |
| `name` | text NOT NULL | from lead form |
| `email` | text NOT NULL | from lead form |
| `phone` | text | optional |
| `company` | text | optional |
| `answers` | jsonb | Full answer map: `{ q1: "A", q2: ["B","C"], q2b: "C", ..., q10: ["F"], q10b: "U3", ... }` |
| `business_type` | text | context value (e.g. `"service"`, `"b2b"`) |
| `sales_method` | text | primary sales method (same as `primary_sales_method`) — kept for backward compat |
| `sales_methods` | jsonb | array of all selected sales methods, e.g. `["social_dm", "messenger"]` |
| `primary_sales_method` | text | same as `sales_method` |
| `monthly_potential_customers` | text | context value (`"1_10"`, `"100_plus"`, etc.) |
| `average_sale_value` | text | context value (`"500_2k"`, `"200k_plus"`, etc.) |
| `lost_investment_risk_score` | int | 0–100 |
| `problem_visibility_score` | int | 0–100 |
| `mri_readiness_score` | int | 0–100 |
| `risk_label` | text | Georgian: `"დაბალი" / "საშუალო" / "საშუალო-მაღალი" / "მაღალი"` |
| `visibility_label` | text | Georgian: `"დაბალი" / "ნაწილობრივი" / "კარგი" / "ძლიერი"` |
| `readiness_label` | text | Georgian: `"ჯერ ადრეა" / "საჭიროა მონაცემების დალაგება" / "ღირს საწყისი განხილვა" / "მზადაა ღრმა დიაგნოსტიკისთვის"` |
| `suspected_loss_point` | text | one of the 7 enum values — primary loss point (kept for backward compat) |
| `suspected_loss_points` | jsonb | array of all selected loss points OR string `"UNKNOWN"` |
| `primary_suspected_loss_point` | text | same as `suspected_loss_point` |
| `result_summary` | jsonb | `{ title, diagnosis, meanings[], checks[], seven_day_action, risk_explanation, visibility_explanation, readiness_explanation }` |
| `email_sent` | boolean | set `true` after user email sent successfully |
| `source` | text | default `"mini_marketing_mri_v2"` |
| `utm_source/medium/campaign/content/term` | text | tracking params from query string |

### Legacy columns (still in table, nullable, ignored by code)
`role`, `website`, `revenue_range`, `team_size`, `dimension_scores`, `total_score`, `percentage`, `health_level`, `primary_bottleneck` — leftover from v1. All NOT NULL constraints dropped. Safe to ignore. Could be removed in a future cleanup migration.

### How to run SQL migrations

1. Open Supabase Dashboard → SQL Editor → New Query
2. Paste contents of new migration file
3. Click **Run**
4. Verify with: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'quiz_submissions';`

**⚠️ Pitfall:** The Supabase SQL editor sometimes concatenates content if you paste into a non-empty editor. Always clear first (`Cmd+A → Delete`) or use the Monaco API: `monaco.editor.getEditors()[0].setValue(sql)`.

---

## 6. Quiz Structure — All 16 Questions

> Source of truth: `src/lib/quiz-data.ts`
>
> Each question has: `id`, `number` (display), `title`, `type` ("single"|"multi"), `options[]`, optional `randomize`, `dynamicOptionsFrom`, `branchOnUnknown`, `contextField`, `helperText`.
>
> Each option has: `key` (A/B/C/...), `label` (Georgian), optional `contextValue`, `modifier`, `suspectedLossPoint`.

| # | id | Type | Title (Georgian) | Notes |
|---|-----|------|------------------|-------|
| 1 | q1 | single | რა ტიპის ბიზნესია? | 7 options (service / ecommerce / local / b2b / education / real_estate / other). `contextField: business_type`. No scoring. |
| 2 | q2 | **multi** | რომელი გზებით ყიდით? მონიშნე ყველა შესაბამისი. | 7 options. No scoring. Feeds q2b. |
| 3 | q2b | single (dynamic) | აქედან რომელი გზაა თქვენთვის მთავარი? | Options filtered to those selected in q2. No scoring. Sets primary `sales_method` context. |
| 4 | q3 | single | თვეში საშუალოდ რამდენი პოტენციური კლიენტი გიკავშირდებათ? | A=unknown / B=1-10 / C=11-30 / D=31-100 / E=100+. Has scoring modifiers. NOT randomized (numeric order). |
| 5 | q4 | single | საშუალოდ ერთი გაყიდვა რამდენია? | 8 options (A=unknown, B=<100₾ → H=200,000+₾). Scaled for high-ticket businesses (real estate, B2B). NOT randomized. |
| 6 | q5 | single **(randomized)** | იცით, რომელი არხიდან მოდის ყველაზე ხარისხიანი პოტენციური კლიენტი? | Graded A→E (worst→best). |
| 7 | q6 | single **(randomized)** | იმ ადამიანებიდან, ვინც გიკავშირდებათ, დაახლოებით რამდენი გადადის რეალურ საუბარში? | Graded. |
| 8 | q7 | single **(randomized)** | საუბრის შემდეგ რამდენ ადამიანს უგზავნით კონკრეტულ შეთავაზებას? | Graded. |
| 9 | q8 | single **(randomized)** | გაგზავნილი შეთავაზებებიდან დაახლოებით რამდენი სრულდება გაყიდვით? | Graded. |
| 10 | q9 | single **(randomized)** | ბოლო 10 დაკარგული პოტენციური კლიენტიდან იცით, რატომ დაიკარგნენ? | Graded. |
| 11 | q10 | **multi** | სად იკარგებიან პოტენციური კლიენტები? მონიშნე ყველა საეჭვო ეტაპი. | 6 options. F="არ ვიცით" is **mutually exclusive** with others. Feeds q10b. |
| 12 | q10b | single (dynamic + branching) | აქედან რომელი გგონია ყველაზე დიდი პრობლემა ახლა? | If q10 includes "F" → swap to alternate title "სად გგონია, ყველაზე დიდი გაურკვევლობაა?" + 5 uncertainty options. Otherwise filtered q10 options. |
| 13 | q11 | single **(randomized)** | გაქვთ თუ არა განმეორებითი დაკავშირების პროცესი? | Graded. |
| 14 | q12 | single **(randomized)** | კვირაში ერთხელ მაინც უყურებთ მარკეტინგისა და გაყიდვების ძირითად ციფრებს? | Graded. |
| 15 | q13 | single **(randomized)** | გაყიდვამდე გზის თითოეულ ეტაპზე იცით, ვინ არის პასუხისმგებელი? | Graded. |
| 16 | q14 | single **(randomized)** | როცა შედეგი არ მოდის, იცით პირველ რიგში რას ცვლით? | Graded. |

### Randomization mechanism

- Questions with `randomize: true` shuffle their options once per session and cache the order in `shuffleCacheRef` (a React ref in `QuizClient.tsx`).
- Going back/forward shows the same shuffled order. Refreshing the page produces a new order.
- Purpose: prevent users from gaming "always pick the last option" for a high score.

### Mutually exclusive option (q10)

`Q10_UNKNOWN_KEY = "F"` in `QuizClient.tsx`. Selecting "F" clears all others; selecting any other option drops "F".

### Conditional follow-up (q10b)

`resolveQuestion()` in `QuizClient.tsx` checks `q.branchOnUnknown`. If the source question (q10) contains the unknown key, swap to the alternate title + options (`Q10B_UNCERTAINTY_OPTIONS` in `quiz-data.ts`). The 5 uncertainty options each map to a different `SuspectedLossPoint`.

---

## 7. Scoring Logic (`src/lib/scoring.ts`)

### Three independent scores (0–100)

1. **`lostInvestmentRiskScore`** — how much could be leaking
2. **`problemVisibilityScore`** — how clearly the user sees their funnel
3. **`mriReadinessScore`** — readiness for the full paid Marketing MRI

### Base scores
```
risk        = 55
visibility  = 50
readiness   = 40
```

### Algorithm
1. Start with base.
2. For each single-select question (except q2b, q10b), apply the selected option's `modifier { risk, visibility, readiness }`.
3. **Q10 (multi) special rules:**
   - If "F" (არ ვიცით) selected → `visibility -= 25, risk += 20`
   - Else if multiple concrete stages selected → `risk += 5 per extra stage`, capped at `+15`
4. Clamp each to `[0, 100]`.
5. Generate labels via `getRiskLabel() / getVisibilityLabel() / getReadinessLabel()`.

### "Best-answer" risk-decrease cap (v2.2 rebalance)

Previously, picking all "best" answers (E) drove risk to 0%, killing booking urgency. Now negative risk modifiers are capped at **-5** per question. With all-best answers, risk lands around **30%** ("საშუალო") — still triggers a CTA.

### Primary Suspected Loss Point — `determinePrimaryLossPoint()`

Priority chain:
1. **q10b answer** (concrete or uncertainty branch) → look up `suspectedLossPoint` on the chosen option.
2. **Fallback:** First match in `lossPointPriority` order found in q10's concrete selections.
3. **Final fallback:** Weak-signal map — for each diagnostic question (q5-q9, q11-q14), if user picked option A or B, add the question's loss-point candidate. Return first match in `lossPointPriority` order. Default: `CONTROL_SYSTEM`.

---

## 8. Loss Points (`src/lib/bottlenecks.ts`)

7 enum values, each with locked Georgian copy: `title`, `diagnosis` (full paragraph), `meanings` (string[]), `checks` (3 practical checks), `sevenDayAction` (single concrete next step).

| Enum | Stage |
|------|-------|
| `BEFORE_CONTACT` | Lost before they reach you |
| `CONTACT_TO_CONVERSATION` | Lost between first contact and real conversation |
| `CONVERSATION_TO_OFFER` | Lost between conversation and proposal |
| `OFFER_TO_SALE` | Lost between proposal and signed deal |
| `FOLLOW_UP` | Lost during follow-up / nurture |
| `MONEY_SOURCE` | Don't know which channel actually drives revenue |
| `CONTROL_SYSTEM` | No system / no decision rhythm |

`lossPointPriority` (in `bottlenecks.ts`) defines the fallback ordering — items earlier in the array win when multiple are candidates.

**Do not freely rewrite this copy.** It's part of the diagnostic methodology. If asked to "improve copy here," ask the user to confirm exact target loss point + exact replacement text.

---

## 9. Email Flow

Both emails fire from `src/app/api/quiz/submit/route.ts` after the Supabase insert succeeds. Both are wrapped in `try/catch` — email failure does **not** fail the submission. Logs go to Vercel function logs.

### User email — `sendDiagnosticEmail()`
- **To:** the user's email
- **From:** `RESEND_FROM_EMAIL`
- **Subject:** `"შენი Mini Marketing MRI შედეგი — სად იკარგება მარკეტინგში ჩადებული ინვესტიცია"`
- **Content:** Dark-themed HTML (`#170303` bg, `#FFB21A` accent). Greeting → 3 score rows → primary loss point title + diagnosis → 3 practical checks → 7-day action callout → booking CTA → disclaimer footer.
- **Dark-mode hardening:** every `<td>` has explicit `bgcolor` attribute + inline `background-color` style, `color-scheme: dark only` meta, MSO fallbacks. Prevents Gmail/Apple Mail auto-inversion to white.

### Admin notification — `sendAdminNotification()`
- **To:** `hello@davitchkotua.com` (hardcoded)
- **Subject:** `"mini Marketing MRI კლიენტი"`
- **Content:** Contact info (name, email as `mailto:` link, phone, company) → 3 scores + primary zone → full table of all 16 answers (question + selected label, handles arrays for multi-select, handles q10b's branched options pool).

After user email sends successfully, the route updates `email_sent = true` on the row.

---

## 10. Result Page (`/result/[id]`)

After submission, redirect to `/result/[id]`. This page is intentionally **minimal**:
- Server component fetches `{ id, name, email }` from Supabase.
- Renders a thank-you confirmation card: greeting → email-sent confirmation → spam-folder reminder → booking CTA.
- **No scores, no loss-point details, no diagnostic content shown.** Everything is in the email. This prevents "I already saw it" drop-off and forces the user to open their inbox (where the booking CTA lives).

If you're asked to "show the result on the page," confirm with the user first — this was a deliberate v2.2 product decision.

---

## 11. Deployment Workflow

### Continuous deployment
- Push to `main` branch → Vercel auto-builds → 2-3 min later, live.
- Check status: https://vercel.com/dashboard → `mini-marketing-mri` project → Deployments tab.
- Production domain alias: `quiz.davitchkotua.com` → routes to current Production deployment.

### Verifying a deploy
1. Vercel dashboard shows the commit SHA next to "Production · Current".
2. Browser may cache old JS — **hard refresh** with `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Win) or use incognito.
3. WebFetch / curl will see "Loading..." on client-rendered pages — this is expected; the quiz is a client component.

### Rolling back
Vercel Dashboard → Deployments → pick a previous deployment → "Promote to Production".

---

## 12. Common Change Tasks

### A. Add or edit a quiz question
Edit `src/lib/quiz-data.ts`:
- Add new entry to `quizQuestions` array.
- Renumber the `number` field for display order.
- If multi-select: `type: "multi"` + `helperText: "შეგიძლია რამდენიმე პასუხი მონიშნო."`
- If graded answers (worst→best): `randomize: true`
- For each option, add `modifier` for scoring impact and/or `suspectedLossPoint` to map to a loss-point candidate.

After adding, verify:
- `validation.ts` automatically picks up new questions (schema is built from `quizQuestions`).
- Scoring `scoring.ts` automatically applies modifiers via the question loop.
- Progress bar denominator updates automatically.

### B. Change scoring weights
Edit option `modifier` values in `src/lib/quiz-data.ts`. Negative risk modifiers are conventionally capped at `-5` (see v2.2 rebalance reasoning).

To change base scores: edit constants at the top of `computeScore()` in `src/lib/scoring.ts`.

### C. Edit loss-point copy
Edit `src/lib/bottlenecks.ts`. Each loss point has `title`, `diagnosis`, `meanings`, `checks`, `sevenDayAction`. Email + admin notification pull from here automatically.

### D. Edit email design
Edit `renderHtml()` in `src/lib/email.ts`. Keep dark-mode hardening (`bgcolor` attrs, `color-scheme` meta).

To preview: send a test submission and check the inbox. There's no local email preview server currently.

### E. Edit thank-you page
Edit `src/app/result/[id]/page.tsx`. Tailwind classes available: `.card`, `.btn-primary`, `text-ink-soft`, `text-ink-muted`, `text-accent`, etc. — see `globals.css`.

### F. Add a new database column
1. Create new migration file: `supabase/migrations/000X_description.sql` (next number in sequence).
2. Run the SQL in Supabase SQL Editor (manual — no automated migration runner is set up).
3. Update `route.ts` `insert` object to write the new column.
4. Update the result page query if you need to read it.

### G. Change CTA destination
Set `BOOK_CALL_URL` env var in Vercel project settings. Used by both email and result page. Default fallback: `https://www.davitchkotua.com/#book-call`.

---

## 13. Known Gotchas

### Pre-existing v1 NOT NULL columns
The 0001 init schema had several NOT NULL columns (`dimension_scores`, `total_score`, `percentage`, `health_level`, `primary_bottleneck`, `result_summary`) that v2 code no longer writes. These constraints have been dropped in production — but if you ever re-init the database, you'll need to drop them again or insertions will fail with "Storage failed".

### Supabase SQL Editor pasting bug
Pasting multi-line SQL into a non-empty editor sometimes concatenates lines without newlines, producing syntax errors like `ALTER TABLE quiz_submissionsALTER COLUMN`. Always clear the editor first (Cmd+A → Delete) or use `monaco.editor.getEditors()[0].setValue(sql)` via DevTools console.

### Email auto-inversion
Gmail / Apple Mail in dark mode aggressively auto-invert "light-looking" emails. Our HTML uses `bgcolor` attributes on every `<td>` + `color-scheme: dark only` to lock the palette. **Do not** remove these — they're load-bearing.

### Client-side rendering
The quiz page is a client component (`"use client"`). Server-side fetch tools see "Loading..." — this is normal. To test the full flow, use a real browser.

### Question ID stability
The `id` field of each question (`q1`, `q2`, `q2b`, ...) is used as the answer key in the `answers` jsonb. Renumbering `number` (display) is safe; **renaming `id` breaks historical data**. Don't rename ids without a data migration plan.

### Multi-select answer shape
The `answers` object stores:
- Single-select: `string` (the option key)
- Multi-select: `string[]` (array of option keys)
- The `Answers` type is `Record<string, string | string[]>` — be careful when reading.

Use the helpers `asArray()` / `asString()` in `scoring.ts` for safe access.

### Dependent answers
- `q2b` depends on `q2` — if user navigates back and changes q2, q2b is cleared (`setAnswers` logic in `QuizClient.tsx`).
- `q10b` depends on `q10` — same.

If you add new dependent questions, replicate this cascade-clear logic in `toggleMulti()` / `selectSingle()`.

---

## 14. Testing Checklist (manual)

Before merging significant changes, run through:

1. **Quiz flow:** Visit `/quiz`, answer all 16 questions, including:
   - Q2 multi-select with 2+ options
   - Q2b shows only selected Q2 options
   - Q10 with "F" (არ ვიცით) — clears other selections
   - Q10b shows the alternate uncertainty title + 5 options when q10 = ["F"]
   - Q10 with multiple concrete options — Q10b shows only those
   - Randomized questions (q5-q9, q11-q14) — order differs across two incognito sessions
2. **Lead form:** Name + email required, consent required. Phone + company optional.
3. **Submission:** Click "შედეგის ნახვა". Should redirect to `/result/[id]`.
4. **Thank-you page:** Shows name, email, spam reminder, booking CTA. **No scores shown.**
5. **User email:** Arrives within ~30 seconds. Dark background (not white). All 3 scores visible. Primary loss point title + diagnosis. 3 checks. 7-day action. CTA button works.
6. **Admin email:** Arrives at `hello@davitchkotua.com`. Subject `"mini Marketing MRI კლიენტი"`. All 16 answers visible with labels (not just keys).
7. **Database:** Row exists in Supabase `quiz_submissions` with all expected fields populated.
8. **Score sanity:** Pick all "best" answers → risk should be ~30%, visibility/readiness near 100%. Pick all "worst" → risk near 100%, visibility/readiness near 0%.

---

## 15. Locked Copy Reference

These strings are brand canon. Do not change without explicit instruction:

| Location | Text |
|----------|------|
| Hero | `სად იკარგება მარკეტინგში ჩადებული შენი ინვესტიცია?` |
| Subhead | `გაიარე 5-წუთიანი Mini Marketing MRI და დაინახე, რომელ ეტაპზე კარგავს შენი ბიზნესი გაყიდვებს, ბიუჯეტს ან ზრდის შანსს.` |
| Primary CTA | `დიაგნოსტიკის დაწყება` |
| Secondary CTA | `დაჯავშნე დიაგნოსტიკური ზარი` |
| Disclaimer | `ეს არ არის სრული Marketing MRI — ეს საწყისი დიაგნოსტიკაა.` |
| Quiz submit button | `შედეგის ნახვა` |
| Multi-select helper | `შეგიძლია რამდენიმე პასუხი მონიშნო.` |
| User email subject | `შენი Mini Marketing MRI შედეგი — სად იკარგება მარკეტინგში ჩადებული ინვესტიცია` |
| Admin email subject | `mini Marketing MRI კლიენტი` |
| Owner attribution | `Davit Chkotua / Marketing Architect Studio` |

---

## 16. Operating Principles (when in doubt)

1. **Reply in Georgian** when communicating with the project owner (Davit Chkotua).
2. **Warn before any paid action** — anything that costs money, sends mass email, or affects production data needs explicit confirmation.
3. **Diagnostic, not prescriptive.** The product shows signals and asks questions. It does not promise outcomes.
4. **Mini ≠ Full MRI.** Always preserve the disclaimer. The mini is intake; the full Marketing MRI is the paid product.
5. **Brand voice:** confident, calm, technical-but-readable. Avoid hype, avoid bro-marketing.
6. **Color palette is locked.** `#170303 / #1f0404 / #FFB21A` — do not introduce new accent colors.

---

## 17. Quick Reference — Where Things Live

| Task | File |
|------|------|
| Change a question's text | `src/lib/quiz-data.ts` |
| Change an option's scoring | `src/lib/quiz-data.ts` (option's `modifier`) |
| Rebalance base scores | `src/lib/scoring.ts` (top of `computeScore`) |
| Edit loss-point diagnostic copy | `src/lib/bottlenecks.ts` |
| Edit user-facing email HTML | `src/lib/email.ts` → `renderHtml()` |
| Edit admin notification email | `src/lib/email.ts` → `sendAdminNotification()` |
| Edit thank-you page | `src/app/result/[id]/page.tsx` |
| Edit landing page | `src/app/page.tsx` |
| Edit submit/storage logic | `src/app/api/quiz/submit/route.ts` |
| Add DB column | `supabase/migrations/000X_*.sql` + `route.ts` insert object |
| Change colors / global styles | `src/app/globals.css` + `tailwind.config.ts` |

---

**End of handoff.** If anything in this file disagrees with the code, the code wins — update this file to match reality and flag the drift to the project owner.
