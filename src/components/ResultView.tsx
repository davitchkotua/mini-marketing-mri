"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

interface ResultProps {
  id: string;
  name: string;
  totalScore: number;
  percentage: number;
  healthLevel: string;
  healthInterpretation: string;
  bottleneck: {
    title: string;
    diagnosis: string;
    symptoms: string[];
    next_step: string;
  };
  recommendedCopy: string;
  bookCallUrl: string;
  fullMriUrl: string;
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
        {props.name}, აი შენი საწყისი შედეგი
      </h1>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat label="ქულა" value={`${props.totalScore}/28`} />
        <Stat label="პროცენტი" value={`${props.percentage}%`} />
        <Stat label="ჯანმრთელობის დონე" value={props.healthLevel} />
      </div>

      <div className="mt-6 card">
        <p className="text-ink-soft leading-relaxed">{props.healthInterpretation}</p>
      </div>

      <div className="mt-6 card">
        <h2 className="text-xl md:text-2xl font-semibold">{props.bottleneck.title}</h2>
        <p className="mt-3 text-ink-soft leading-relaxed">{props.bottleneck.diagnosis}</p>
        <ul className="mt-4 space-y-2">
          {props.bottleneck.symptoms.map((s) => (
            <li key={s} className="flex gap-3 text-ink-soft">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-lg bg-paper border border-line p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
            შემდეგი ნაბიჯი
          </p>
          <p className="mt-2 text-ink-soft leading-relaxed">{props.bottleneck.next_step}</p>
        </div>
      </div>

      <div className="mt-6 card bg-ink text-paper border-ink">
        <p className="text-xs uppercase tracking-[0.18em] text-paper/60">
          რეკომენდაცია
        </p>
        <p className="mt-2 leading-relaxed">{props.recommendedCopy}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="https://www.davitchkotua.com/#book-call"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("call_cta_clicked", { id: props.id })}
            className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-base font-medium text-ink hover:bg-paper"
          >
            დაჯავშნე ზარი
          </a>
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-muted">
        ეს არის საწყისი მსუბუქი დიაგნოსტიკა და არა სრული Marketing MRI. დეტალური შედეგი ასევე გაგზავნილია შენს ელფოსტაზე.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card py-4">
      <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
