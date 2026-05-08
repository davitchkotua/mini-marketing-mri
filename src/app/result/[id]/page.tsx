import { notFound } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface ResultRow {
  id: string;
  name: string;
  email: string;
}

export default async function ResultPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("quiz_submissions")
    .select("id,name,email")
    .eq("id", params.id)
    .single<ResultRow>();

  if (error || !data) notFound();

  const bookCallUrl =
    process.env.BOOK_CALL_URL || "https://www.davitchkotua.com/#book-call";

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:py-24">
      <div className="card text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 text-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16v16H4z" />
            <path d="M4 7l8 6 8-6" />
          </svg>
        </div>

        <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
          მინი დიაგნოსტიკა
        </p>
        <h1 className="mt-2 text-2xl md:text-3xl font-semibold leading-snug">
          {data.name}, მადლობა — შენი შედეგი ელფოსტაზე გამოგზავნილია.
        </h1>

        <p className="mt-5 text-ink-soft leading-relaxed">
          საწყისი დიაგნოსტიკა გამოგიგზავნე ამ მისამართზე:
        </p>
        <p className="mt-2 text-base font-medium text-accent">{data.email}</p>

        <p className="mt-6 text-sm text-ink-muted leading-relaxed">
          შემოწმე საფოსტო ყუთი (ასევე <span className="text-ink-soft">Spam</span> ან <span className="text-ink-soft">Promotions</span> საქაღალდე) — წერილში ნახავ შენს 3 ქულას, საეჭვო ზონას და 7-დღიან გეგმას.
        </p>

        <div className="mt-10 border-t border-line pt-8">
          <h2 className="text-lg md:text-xl font-semibold leading-snug">
            გინდა, ერთად გავშალოთ შენი შედეგი?
          </h2>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            დიაგნოსტიკურ ზარზე ვნახავთ, რომელი სიგნალია შენთვის ყველაზე ღირებული და საიდან უნდა დაიწყო.
          </p>
          <a
            href={bookCallUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 inline-block"
          >
            დაჯავშნე დიაგნოსტიკური ზარი
          </a>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-ink-muted">
        ეს არის საწყისი დიაგნოსტიკა — სრული Marketing MRI უფრო ღრმად განიხილავს თითოეულ ეტაპს.
      </p>
    </div>
  );
}
