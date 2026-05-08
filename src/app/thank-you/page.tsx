import Link from "next/link";

export const metadata = { title: "მადლობა — Mini Marketing MRI" };

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">მადლობა</p>
      <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
        შენი საწყისი დიაგნოსტიკა გაგზავნილია
      </h1>
      <p className="mt-4 text-ink-soft leading-relaxed">
        შეამოწმე ელფოსტა — გამოგზავნილია შენი Mini Marketing MRI შედეგი და რეკომენდირებული შემდეგი ნაბიჯი. თუ ვერ ხედავ — შეამოწმე spam ფოლდერი.
      </p>
      <div className="mt-8">
        <Link href="/" className="btn-secondary">
          მთავარ გვერდზე დაბრუნება
        </Link>
      </div>
    </div>
  );
}
