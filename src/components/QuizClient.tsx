"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { quizQuestions, revenueRanges, teamSizeRanges, type DimensionKey } from "@/lib/quiz-data";
import { track } from "@/lib/analytics";
import { ProgressBar } from "./ProgressBar";

type Answers = Partial<Record<DimensionKey, number>>;
type Lead = {
  name: string;
  email: string;
  company: string;
  role: string;
  website: string;
  revenue_range: string;
  team_size: string;
  consent: boolean;
};

const emptyLead: Lead = {
  name: "",
  email: "",
  company: "",
  role: "",
  website: "",
  revenue_range: "",
  team_size: "",
  consent: false,
};

const totalSteps = quizQuestions.length + 1; // questions + lead form

export function QuizClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [lead, setLead] = useState<Lead>(emptyLead);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadErrors, setLeadErrors] = useState<Partial<Record<keyof Lead, string>>>({});

  useEffect(() => {
    track("quiz_started");
  }, []);

  const utm = useMemo(
    () => ({
      utm_source: searchParams.get("utm_source") ?? undefined,
      utm_medium: searchParams.get("utm_medium") ?? undefined,
      utm_campaign: searchParams.get("utm_campaign") ?? undefined,
      utm_content: searchParams.get("utm_content") ?? undefined,
      utm_term: searchParams.get("utm_term") ?? undefined,
    }),
    [searchParams]
  );

  const isQuestionStep = step < quizQuestions.length;
  const currentQuestion = isQuestionStep ? quizQuestions[step] : null;
  const currentAnswer = currentQuestion ? answers[currentQuestion.key] : undefined;

  function next() {
    if (isQuestionStep && currentQuestion) {
      if (typeof currentAnswer !== "number") {
        setError("გთხოვ, წინ გადასასვლელად პასუხი აირჩიო.");
        return;
      }
      track("quiz_step_completed", { step: step + 1, key: currentQuestion.key });
    }
    setError(null);
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function selectAnswer(score: number) {
    if (!currentQuestion) return;
    setAnswers((a) => ({ ...a, [currentQuestion.key]: score }));
    setError(null);
  }

  function validateLead(): boolean {
    const errs: Partial<Record<keyof Lead, string>> = {};
    if (!lead.name.trim()) errs.name = "სახელი აუცილებელია";
    if (!lead.email.trim()) errs.email = "ელფოსტა აუცილებელია";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))
      errs.email = "შეიყვანე ვალიდური ელფოსტა";
    if (!lead.company.trim()) errs.company = "კომპანიის სახელი აუცილებელია";
    if (!lead.role.trim()) errs.role = "შენი როლი აუცილებელია";
    if (!lead.consent) errs.consent = "თანხმობა აუცილებელია";
    setLeadErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit() {
    if (!validateLead()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, answers, utm }),
      });
      const json = await res.json();
      if (!res.ok || !json.id) {
        throw new Error(json.error || "შენახვა ვერ მოხერხდა");
      }
      track("quiz_submitted", { id: json.id });
      router.push(`/result/${json.id}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "მოხდა შეცდომა";
      setError(msg);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 md:py-16">
      <ProgressBar current={step + 1} total={totalSteps} />

      <div className="mt-8 card">
        {currentQuestion ? (
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
              {currentQuestion.dimensionLabel}
            </p>
            <h2 className="mt-2 text-xl md:text-2xl font-semibold leading-snug">
              {currentQuestion.question}
            </h2>
            <ul className="mt-6 space-y-2">
              {currentQuestion.answers.map((a) => {
                const selected = currentAnswer === a.score;
                return (
                  <li key={a.score}>
                    <button
                      type="button"
                      onClick={() => selectAnswer(a.score)}
                      className={[
                        "w-full text-left rounded-lg border px-4 py-3 transition",
                        selected
                          ? "border-ink bg-ink text-paper"
                          : "border-line bg-white hover:border-ink",
                      ].join(" ")}
                    >
                      <span className="block text-sm leading-relaxed">{a.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
              შენი საკონტაქტო
            </p>
            <h2 className="mt-2 text-xl md:text-2xl font-semibold leading-snug">
              სად გამოგიგზავნოთ შენი საწყისი დიაგნოსტიკა?
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              ამ ინფორმაციას ვიყენებთ მხოლოდ შენი შედეგისა და შესაბამისი რეკომენდაციების გამოსაგზავნად.
            </p>

            <div className="mt-6 grid gap-4">
              <Field
                label="სახელი *"
                value={lead.name}
                onChange={(v) => setLead({ ...lead, name: v })}
                error={leadErrors.name}
              />
              <Field
                label="ელფოსტა *"
                type="email"
                value={lead.email}
                onChange={(v) => setLead({ ...lead, email: v })}
                error={leadErrors.email}
              />
              <Field
                label="კომპანია *"
                value={lead.company}
                onChange={(v) => setLead({ ...lead, company: v })}
                error={leadErrors.company}
              />
              <Field
                label="შენი როლი *"
                placeholder="Founder, CEO, Marketing Lead..."
                value={lead.role}
                onChange={(v) => setLead({ ...lead, role: v })}
                error={leadErrors.role}
              />
              <Field
                label="ვებსაიტი ან სოც. გვერდი (არასავალდებულო)"
                value={lead.website}
                onChange={(v) => setLead({ ...lead, website: v })}
              />
              <SelectField
                label="თვიური შემოსავლის დიაპაზონი (არასავალდებულო)"
                value={lead.revenue_range}
                onChange={(v) => setLead({ ...lead, revenue_range: v })}
                options={revenueRanges}
              />
              <SelectField
                label="გუნდის ზომა (არასავალდებულო)"
                value={lead.team_size}
                onChange={(v) => setLead({ ...lead, team_size: v })}
                options={teamSizeRanges}
              />

              <label className="mt-2 flex items-start gap-3 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={lead.consent}
                  onChange={(e) => setLead({ ...lead, consent: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-line"
                />
                <span>
                  ვეთანხმები, რომ Mini Marketing MRI-ის შედეგები და დაკავშირებული რეკომენდაციები ელფოსტაზე მივიღო.
                </span>
              </label>
              {leadErrors.consent && <p className="err">{leadErrors.consent}</p>}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-warn/40 bg-warn/5 px-3 py-2 text-sm text-warn">
            {error}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || submitting}
            className="btn-ghost disabled:opacity-40"
          >
            უკან
          </button>
          {isQuestionStep ? (
            <button type="button" onClick={next} className="btn-primary">
              {step === quizQuestions.length - 1 ? "საკონტაქტოზე გადასვლა" : "შემდეგი"}
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? "იგზავნება..." : "შედეგის მიღება"}
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-ink-muted">
        ეს არ არის სრული Marketing MRI — ეს საწყისი მსუბუქი დიაგნოსტიკაა.
      </p>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="label">{props.label}</label>
      <input
        type={props.type ?? "text"}
        className="field"
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
      {props.error && <p className="err">{props.error}</p>}
    </div>
  );
}

function SelectField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="label">{props.label}</label>
      <select
        className="field"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="">— აირჩიე —</option>
        {props.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
