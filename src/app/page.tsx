import Link from "next/link";

const dimensions = [
  "შემოსავლის წყაროები",
  "შეთავაზების სიძლიერე",
  "სამიზნე აუდიტორიები",
  "პირველი შეხებიდან გაყიდვამდე გზა",
  "დაკარგული შემოსავალი",
  "შესრულების რიტმი",
  "გადაწყვეტილებების სისტემა",
];

const symptoms = [
  "რეკლამაში ფული იხარჯება, მაგრამ გაყიდვები არ იზრდება შესაბამისი ტემპით",
  "დაინტერესებული ადამიანები მოდიან, მაგრამ ბევრი გზაში იკარგება",
  "არ ჩანს, რომელი არხი ქმნის რეალურ შემოსავალს",
  "გუნდი დაკავებულია, მაგრამ პროგრესი არ გროვდება",
  "გადაწყვეტილებები ხშირად შეგრძნებით მიიღება და არა მონაცემით",
];

const outcomes = [
  "დაკარგული ინვესტიციის რისკის ქულა",
  "პრობლემის ხილვადობის ქულა",
  "Marketing MRI-სთვის მზადყოფნის ქულა",
  "პირველი შესამოწმებელი ზონა",
  "3 პრაქტიკული შემოწმება",
  "7-დღიანი მოქმედების გეგმა",
  "მინი ანგარიში ელფოსტაზე",
];

export default function LandingPage() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-5 py-20 md:py-28">
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-ink-muted">
            Diagnostic-lite assessment
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight max-w-3xl">
            სად იკარგება მარკეტინგში ჩადებული შენი ინვესტიცია?
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft leading-relaxed">
            გაიარე 5-წუთიანი Mini Marketing MRI და დაინახე, რომელ ეტაპზე კარგავს
            შენი ბიზნესი გაყიდვებს, ბიუჯეტს ან ზრდის შანსს.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/quiz" className="btn-primary">
              დიაგნოსტიკის დაწყება
            </Link>
          </div>
          <p className="mt-8 max-w-2xl text-sm text-ink-muted leading-relaxed">
            ეს არ არის სრული Marketing MRI. ეს არის საწყისი დიაგნოსტიკა, რომელიც
            გაჩვენებს, სად შეიძლება იწყებოდეს პრობლემა და საიდან ღირს უფრო ღრმა
            ანალიზის დაწყება.
          </p>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              მარკეტინგი მუშაობს, მაგრამ ინვესტიციის დაბრუნება ბოლომდე არ ჩანს
            </h2>
            <p className="mt-4 text-ink-soft leading-relaxed">
              ბევრი ბიზნესი აკეთებს რეკლამას, ქმნის კონტენტს, უშვებს კამპანიებს,
              პასუხობს პოტენციურ კლიენტებს და მუდმივად რაღაცას აკეთებს. მაგრამ
              ხშირად არ ჩანს მთავარი: რა ქმნის რეალურ შემოსავალს, რა არის
              უბრალოდ აქტივობა და სად იკარგება მარკეტინგში ჩადებული ინვესტიცია.
            </p>
            <p className="mt-3 text-ink-soft leading-relaxed">
              პრობლემა შეიძლება არც ერთ კონკრეტულ არხში იყოს. შეიძლება გაყიდვამდე
              გზა მთლიანად არ აჩვენებდეს, სად ჩერდება ადამიანი და რატომ არ
              სრულდება ინტერესი გაყიდვით.
            </p>
          </div>
          <ul className="space-y-3">
            {symptoms.map((s) => (
              <li key={s} className="flex gap-3 text-ink-soft">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="what-it-checks" className="border-b border-line">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            რას ამოწმებს ქვიზი — 7 დიაგნოსტიკური ღერძი
          </h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {dimensions.map((d, i) => (
              <div key={d} className="card flex items-start gap-3 py-4">
                <span className="text-ink-muted text-sm tabular-nums w-5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-medium">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              რას იღებ ქვიზის ბოლოს
            </h2>
            <p className="mt-4 text-ink-soft leading-relaxed">
              შედეგი არ არის ვერდიქტი — ეს არის საწყისი წერტილი, რომელიც
              გაჩვენებს, სად ღირს უფრო ღრმა დიაგნოსტიკა Marketing MRI-ს ფარგლებში.
            </p>
          </div>
          <ul className="space-y-3">
            {outcomes.map((o) => (
              <li key={o} className="flex gap-3 text-ink-soft">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-5xl px-5 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            დაიწყე Mini Marketing MRI
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-soft">
            5 წუთი. 14 კითხვა. პერსონალიზებული საწყისი დიაგნოსტიკა შენს
            ელფოსტაზე.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/quiz" className="btn-primary">
              დიაგნოსტიკის დაწყება
            </Link>
            <a
              href="https://www.davitchkotua.com/#book-call"
              className="btn-ghost"
            >
              დაჯავშნე ზარი
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
