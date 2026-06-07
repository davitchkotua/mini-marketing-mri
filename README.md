# Mini Marketing MRI

> 16-კითხვიანი დიაგნოსტიკური ქვიზი ქართული ბიზნესებისთვის — სად კარგავს ბიზნესი მარკეტინგში ჩადებულ ინვესტიციას.
>
> **Live:** [quiz.davitchkotua.com](https://quiz.davitchkotua.com)
>
> ეს არის lead-generation ინსტრუმენტი [Marketing Architect Studio](https://www.davitchkotua.com)-სთვის. შევსების შემდეგ ვიზიტორი იღებს პერსონალიზებულ მინი დიაგნოსტიკას ელფოსტაზე და CTA-ს დიაგნოსტიკური ზარის დასაჯავშნად.

---

## 📖 ჯერ ეს წაიკითხე (ნებისმიერი ცვლილების წინ)

თუ ხარ ახალი დეველოპერი ან AI agent (ChatGPT Codex, Claude, Cursor, etc.):

1. წაიკითხე **[`AGENTS.md`](./AGENTS.md)** — სრული ტექნიკური კონტექსტი (არქიტექტურა, scoring ლოგიკა, ფაილების სტრუქტურა, gotchas, ყველაფერი).
2. შემდეგ დაუბრუნდი ამ README-ს ოპერაციული ნაწილისთვის (პლატფორმები, წვდომა, deploy).

ეს ფაილი **გვიჩვენებს რა საიდან მართოს** — `AGENTS.md` **გვიჩვენებს როგორ შეცვალო კოდი**.

---

## 🎯 რა აკეთებს ეს პროდუქტი

**ვისთვისაა:** ქართული SMB-ები (გადახდისუნარიანი მცირე და საშუალო ბიზნესები) რომლებიც ბიუჯეტს ხარჯავენ მარკეტინგზე, მაგრამ შედეგი არ ჩანს.

**რას აკეთებს:**
1. ვიზიტორი ხსნის ლენდინგ გვერდს → იწყებს ქვიზს (16 კითხვა, ~5 წუთი)
2. ბოლოს ავსებს კონტაქტს (სახელი, ემეილი, ტელეფონი, კომპანია)
3. იღებს მინი დიაგნოსტიკას **ელფოსტაზე** — 3 ქულა, საეჭვო ზონა, 3 პრაქტიკული შემოწმება, 7-დღიანი მოქმედების გეგმა
4. ემეილში CTA → დიაგნოსტიკური ზარის დაჯავშნა
5. ზარი → შესაძლო კონვერსია სრულ Marketing MRI-ში (4,000₾ პროდუქტი)

**რას არ აკეთებს:** ეს არ არის სრული Marketing MRI. ეს არის **საწყისი დიაგნოსტიკა** — სიგნალები, არა ვერდიქტი. ეს დისკლეიმერი ყველგან უნდა იყოს (landing, quiz, email).

---

## 🔗 ყველა პლატფორმა (ცხრილი)

| რა | URL | ვისთვის |
|----|-----|---------|
| **Live საიტი** | [quiz.davitchkotua.com](https://quiz.davitchkotua.com) | მომხმარებლები |
| **GitHub Repo** | [github.com/davitchkotua/mini-marketing-mri](https://github.com/davitchkotua/mini-marketing-mri) | კოდი |
| **Vercel Dashboard** | [vercel.com](https://vercel.com) → `mini-marketing-mri` | Deploy, logs, env vars |
| **Supabase Dashboard** | [supabase.com/dashboard/project/shvzebnvqcqyvcddruki](https://supabase.com/dashboard/project/shvzebnvqcqyvcddruki) | DB, SQL editor, submissions |
| **Resend Dashboard** | [resend.com/dashboard](https://resend.com/dashboard) | Email logs, API keys |
| **Custom Domain DNS** | [godaddy.com](https://godaddy.com) | `davitchkotua.com` DNS |
| **Admin notification ემეილი** | hello@davitchkotua.com | submission alerts |
| **Booking CTA destination** | [davitchkotua.com/#book-call](https://www.davitchkotua.com/#book-call) | Cal.com booking page |

---

## 🔐 წვდომა და პაროლები

ყველა ანგარიში **Davit Chkotua**-ს ბრენდულ ანგარიშზე რეგისტრირებულია.

### პაროლები / API keys

> ⚠️ **არცერთი პაროლი/key ამ რეპოში არ უნდა მოხვდეს.** ყველაფერი Vercel env vars-ში ან password manager-შია.

| სად | რა გჭირდება | სად ნახო |
|-----|-------------|----------|
| Vercel | Account login | `davitchkotua@gmail.com` — Google login |
| GitHub | repo write access | `davitchkotua` account |
| Supabase | project access | invited team member, ან owner login |
| Resend | API key | Resend Dashboard → API Keys (owner-ის წვდომა) |
| Domain (GoDaddy) | DNS management | GoDaddy account credentials |
| `hello@davitchkotua.com` | inbox | Davit-ის Google Workspace |

**პაროლების შენახვა:** [აქ ჩაწერე შენი password manager — 1Password / Bitwarden / Apple Keychain / etc.]

**ვისზე მისწერო წვდომისთვის:** **Davit Chkotua** — owner, [hello@davitchkotua.com](mailto:hello@davitchkotua.com)

---

## ⚙️ Environment Variables (Vercel)

Vercel Dashboard → Project → Settings → Environment Variables-ში დაყენებულია:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://shvzebnvqcqyvcddruki.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role — server-only, RLS-ს გადასაბიჯებლად>
RESEND_API_KEY=<Resend API key>
RESEND_FROM_EMAIL="Davit Chkotua <hello@davitchkotua.com>"
BOOK_CALL_URL=https://www.davitchkotua.com/#book-call
```

**ლოკალური დეველოპმენტისთვის:** გადააკოპირე ეს Vercel-დან `.env.local` ფაილში პროექტის root-ში. `.env.local` `.gitignore`-შია — არასდროს ჩააკომიტო.

---

## 🏗️ Tech Stack (მოკლედ)

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS (dark theme `#170303` / accent `#FFB21A`)
- **Database:** Supabase (PostgreSQL + Row Level Security)
- **Email:** Resend
- **Validation:** Zod
- **Hosting:** Vercel (auto-deploy `main` branch-დან)

დეტალური ფაილ-სტრუქტურა და როგორ რა მუშაობს → **[`AGENTS.md`](./AGENTS.md)**

---

## 🚀 როგორ მუშაობს Deploy

ერთი წინადადებით: **GitHub `main` branch-ზე push → Vercel აავტომატურად აშენებს და 2-3 წუთში ცოცხალია.**

### ნაბიჯ-ნაბიჯ:
1. ლოკალურად შეცვალე კოდი
2. `git add . && git commit -m "..." && git push origin main`
3. გახსენი [Vercel Dashboard](https://vercel.com) — Deployments tab-ში დაინახავ ახალ build-ს ("Building" → "Ready")
4. როცა "Ready" გახდება, **hard refresh** ბრაუზერში: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Win)
5. quiz.davitchkotua.com-ზე უკვე ცოცხალია

### Rollback (თუ რამე გაფუჭდა)
Vercel Dashboard → Deployments → იპოვე წინა მუშა deployment → ⋯ → **Promote to Production**.

---

## 🗄️ Database — როგორ ნახო Submissions

1. გახსენი [Supabase Dashboard](https://supabase.com/dashboard/project/shvzebnvqcqyvcddruki)
2. მარცხნივ → **Table Editor** → `quiz_submissions`
3. ან: **SQL Editor** → New Query →
   ```sql
   SELECT name, email, phone, company, created_at,
          lost_investment_risk_score, problem_visibility_score, mri_readiness_score,
          primary_suspected_loss_point
   FROM quiz_submissions
   ORDER BY created_at DESC
   LIMIT 50;
   ```

---

## 📧 ემეილ ფლოუ

ყოველი submission-ის შემდეგ ავტომატურად იგზავნება **ორი** ემეილი (Resend-ით):

1. **მომხმარებლის ემეილზე** — პერსონალიზებული მინი დიაგნოსტიკა (3 ქულა, საეჭვო ზონა, 7-დღიანი გეგმა, CTA).
2. **hello@davitchkotua.com-ზე** — admin notification, subject `mini Marketing MRI კლიენტი`, შიგნით სრული კონტაქტი + ყველა 16 პასუხი + ქულები.

**Email logs:** [Resend Dashboard](https://resend.com/dashboard) → Emails tab — ნახავ რომელი მისულია, რომელი bounce-დება.

---

## 🛠️ ხშირი ოპერაციები

| რა მინდა გავაკეთო | სად მივიდე |
|-------------------|-----------|
| კოდის ცვლილება | ლოკალურად → commit → push → Vercel auto-deploy |
| Submissions ნახვა | Supabase → Table Editor → `quiz_submissions` |
| ემეილების ისტორია | Resend Dashboard → Emails |
| DB schema-ის ცვლილება | Supabase → SQL Editor-ში SQL ხელით + `supabase/migrations/`-ში ფაილი |
| Vercel logs | Vercel Dashboard → Logs tab |
| Env var-ის ცვლილება | Vercel → Settings → Environment Variables → ცვლილების შემდეგ **redeploy** |
| Domain-ის ცვლილება | GoDaddy DNS + Vercel → Settings → Domains |

---

## ⚠️ ცნობილი პრობლემები (Gotchas)

1. **Supabase SQL Editor paste bug:** Multi-line SQL-ის paste-ი ხანდახან ხაზებს ერთმანეთში აერთებს. ჯერ Cmd+A → Delete, შემდეგ paste.
2. **Browser cache:** Vercel-ის deploy-ის შემდეგ აუცილებლად **hard refresh** (`Cmd+Shift+R`), თორემ ძველი JS bundle-ი დაგრჩება.
3. **Email auto-inversion:** Gmail / Apple Mail dark mode-ში თეთრად აქცევს ემეილს. HTML-ში `bgcolor` ატრიბუტები ჩამატებულია — **არ წაშალო**.
4. **Legacy v1 columns:** DB-ში არსებობს ძველი v1 სვეტები (`dimension_scores`, `total_score`, etc.). NOT NULL-ი ჩამოშლილია, მაგრამ თუ ოდესმე re-init გააკეთო, ხელახლა მოგიწევს ჩამოშლა.

დანარჩენი → `AGENTS.md` § 13 "Known Gotchas".

---

## 📝 ცვლილების შემდეგ რა შევამოწმო

`AGENTS.md` § 14 "Testing Checklist"-ში სრული 8-პუნქტიანი QA სია. შემოკლებით:

1. გაიარე ქვიზი ბოლომდე (16 კითხვა)
2. შეავსე lead form
3. დაჯვერდი thank-you გვერდზე
4. შემოწმე **შენი ემეილი** (dark theme, ყველა ქულა)
5. შემოწმე `hello@davitchkotua.com` (admin notification, ყველა პასუხი)
6. შემოწმე Supabase row შესაბამისი მონაცემებით

---

## 🆘 თუ რამე გაფუჭდა

| სიმპტომი | რა შეამოწმე |
|----------|-------------|
| საიტი არ იხსნება | Vercel → Deployments → Production status |
| Quiz submission ფეილდება | Vercel → Logs → `/api/quiz/submit` errors |
| ემეილი არ მოდის | Resend Dashboard → Emails tab |
| Submission DB-ში არ ხვდება | Supabase → Logs → SQL queries |
| Custom domain არ მუშაობს | GoDaddy DNS + Vercel → Domains |

ვერ მოაგვარე? — დაუკავშირდი **Davit Chkotua**-ს ([hello@davitchkotua.com](mailto:hello@davitchkotua.com)).

---

## 📚 დამატებითი ფაილები

- **[`AGENTS.md`](./AGENTS.md)** — სრული ტექნიკური დოკუმენტაცია (450+ ხაზი, ყველაფერი კოდის შესახებ)
- **[`HANDOFF.md`](./HANDOFF.md)** — იგივე რაც AGENTS.md, ადამიანებისთვის სახელით
- **`supabase/migrations/`** — DB schema-ის ისტორია

---

## 🧭 ბრენდ კონტექსტი

ეს პროდუქტი **Marketing Architect Studio**-ს ნაწილია — Davit Chkotua-ს კონსალტინგ პრაქტიკის. სტუდიაში ხუთი მთავარი პროდუქტია:

1. Marketing MRI (4,000₾ / 14 დღე) — სრული დიაგნოსტიკა, **ეს ქვიზი არის intake**
2. Marketing Outsourcing
3. Practical Marketing (კურსი)
4. Marketing Architect OS
5. Davit-Led консультация

ბრენდის ფერები: `#170303` ფონი + `#FFB21A` accent. ხმა: დიაგნოსტიკური, თავდაჯერებული, არა hype.

---

**მაინტეინერი:** Davit Chkotua — [davitchkotua.com](https://www.davitchkotua.com) — [hello@davitchkotua.com](mailto:hello@davitchkotua.com)
