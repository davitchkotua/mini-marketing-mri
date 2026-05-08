"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

interface LossPointDisplay {
  title: string;
  diagnosis: string;
  meanings: string[];
  checks: string[];
  sevenDayAction: string;
}

interface ResultProps {
  id: string;
  name: string;
  riskScore: number;
  visibilityScore: number;
  readinessScore: number;
  riskLabel: string;
  visibilityLabel: string;
  readinessLabel: string;
  riskExplanation: string;
  visibilityExplanation: string;
  readinessExplanation: string;
  lossPoint: LossPointDisplay;
  bookCallUrl: string;
}

export function ResultView(props: ResultProps) {
  useEffect(() => {
    track("result_viewed", { id: props.id });
  }, [props.id]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
        Mini Marketing MRI · საწყისი დიაგნოსტიკა
      </p>
      <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
        {props.name}, შენი შედეგი მზადაა
      </h1>
      <p className="mt-3 text-ink-soft leading-relaxed">
        ქვემოთ არის სამი ქულა, რომელიც გაჩვენებს, სად შეიძლება იკარგებოდეს
        მარკეტინგში ჩადებული ინვესტიცია, რამდენად ჩანს პრობლემა და რამდენად ხარ
        მზად სრული Marketing MRI-სთვის.
      </p>

      {/* Three score cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ScoreCard
          label="დაკარგული ინვესტიციის რისკი"
          score={props.riskScore}
          tag={props.riskLabel}
          accent
        />
        <ScoreCard
          label="პრობლემის ხილვადობა"
          score={props.visibilityScore}
          tag={props.visibilityLabel}
        />
        <ScoreCard
          label="Marketing MRI-სთვის მზადყოფნა"
          score={props.readinessScore}
          tag={props.readinessLabel}
        />
      </div>

      {/* Score explanations */}
      <div className="mt-6 grid gap-4">
        <ExplanationCard
          eyebrow="რისკის ინტერპრეტაცია"
          text={props.riskExplanation}
        />
        <ExplanationCard
          eyebrow="ხილვადობის ინტერპრეტაცია"
          text={props.visibilityExplanation}
        />
        <ExplanationCard
          eyebrow="Marketing MRI-სთვის მზადყოფნა"
          text={props.readinessExplanation}
        />
      </div>

      {/* Loss point section */}
      <div className="mt-8 card">
        <p className="text-xs uppercase tracking-[0.18em] text-accent/80">
          პირველი შესამოწმებელი ზონა
        </p>
        <h2 className="mt-2 text-xl md:text-2xl font-semibold leading-snug">
          {props.lossPoint.title}
        </h2>
        <p className="mt-3 text-ink-soft leading-relaxed">
          {props.lossPoint.diagnosis}
        </p>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
            რას შეიძლება ნიშნავდეს ეს
          </p>
          <ul className="mt-2 space-y-2">
            {props.lossPoint.meanings.map((m) => (
              <li key={m} className="flex gap-3 text-ink-soft">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink shrink-0" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
            3 პრაქტიკული შემოწმება
          </p>
          <ol className="mt-2 space-y-2">
            {props.lossPoint.checks.map((c, i) => (
              <li key={c} className="flex gap-3 text-ink-soft">
                <span className="text-accent font-semibold tabular-nums shrink-0">
                  {i + 1}.
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-accent/80">
            7-დღიანი მოქმედება
          </p>
          <p className="mt-2 text-ink leading-relaxed">
            {props.lossPoint.sevenDayAction}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 rounded-xl border border-accent/30 bg-accent/10 p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-accent/80">
          რეკომენდებული შემდეგი ნაბიჯი
        </p>
        <p className="mt-2 text-lg font-semibold text-ink">
          თუ გინდა გავიგოთ, ეს პრობლემა რეალურად სად იწყება და ღირს თუ არა სრული
          Marketing MRI, დაჯავშნე მოკლე დიაგნოსტიკური ზარი.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={props.bookCallUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("diagnostic_call_clicked", { id: props.id })}
            className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-base font-medium text-[#170303] hover:bg-accent-hover transition"
          >
            დაჯავშნე დიაგნოსტიკური ზარი
          </a>
          <a
            href={props.bookCallUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("full_mri_clicked", { id: props.id })}
            className="inline-flex items-center justify-center rounded-lg border border-line px-5 py-3 text-base font-medium text-ink-soft hover:border-ink/60 hover:text-ink transition"
          >
            მინდა Full Marketing MRI-ის განხილვა
          </a>
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-muted leading-relaxed">
        ეს არის საწყისი დიაგნოსტიკა და არა სრული Marketing MRI. ზუსტი მიზეზების
        დასადგენად საჭიროა მონაცემების, გაყიდვამდე გზისა და კონტექსტის უფრო ღრმა
        ანალიზი. შედეგი ასევე გაგზავნილია შენს ელფოსტაზე.
      </p>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  tag,
  accent = false,
}: {
  label: string;
  score: number;
  tag: string;
  accent?: boolean;
}) {
  return (
    <div className={`card py-5 ${accent ? "border-accent/40" : ""}`}>
      <p className="text-xs uppercase tracking-[0.14em] text-ink-muted leading-snug">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">
        {score}
        <span className="text-base text-ink-muted">%</span>
      </p>
      <p
        className={`mt-1 text-sm font-medium ${
          accent ? "text-accent" : "text-ink-soft"
        }`}
      >
        {tag}
      </p>
    </div>
  );
}

function ExplanationCard({ eyebrow, text }: { eyebrow: string; text: string }) {
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
        {eyebrow}
      </p>
      <p className="mt-2 text-ink-soft leading-relaxed">{text}</p>
    </div>
  );
}
