"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { quizQuestions, type QuizOption, type QuizQuestion } from "@/lib/quiz-data";
import { track } from "@/lib/analytics";
import { ProgressBar } from "./ProgressBar";

type AnswerValue = string | string[];
type Answers = Record<string, AnswerValue>;

type Lead = {
  name: string;
  email: string;
  phone: string;
  company: string;
  consent: boolean;
};

const emptyLead: Lead = {
  name: "",
  email: "",
  phone: "",
  company: "",
  consent: false,
};

const totalSteps = quizQuestions.length + 1; // questions + lead form

/** Mutual-exclusion key for q10 — selecting "F" (არ ვიცით) clears all others. */
const Q10_UNKNOWN_KEY = "F";

/**
 * Resolve which options to render and which title to show, accounting for
 * dynamic option filtering (q2b ← q2) and unknown-branch swap (q10b ← q10).
 */
function resolveQuestion(q: QuizQuestion, answers: Answers): {
  title: string;
  options: QuizOption[];
  helperText?: string;
} {
  // Branched on unknown — swap title + options
  if (q.branchOnUnknown) {
    const sourceAns = answers[q.branchOnUnknown.qid];
    const arr = Array.isArray(sourceAns) ? sourceAns : sourceAns ? [sourceAns] : [];
    if (arr.includes(q.branchOnUnknown.unknownKey)) {
      return {
        title: q.branchOnUnknown.title,
        options: q.branchOnUnknown.options,
        helperText: q.helperText,
      };
    }
  }

  // Dynamic options from a previous multi-select answer
  if (q.dynamicOptionsFrom) {
    const sourceAns = answers[q.dynamicOptionsFrom];
    const selectedKeys = Array.isArray(sourceAns)
      ? sourceAns
      : sourceAns
      ? [sourceAns]
      : [];
    return {
      title: q.title,
      options: q.options.filter((o) => selectedKeys.includes(o.key)),
      helperText: q.helperText,
    };
  }

  return { title: q.title, options: q.options, helperText: q.helperText };
}

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

  // Cache shuffled options per question so the order stays stable when
  // the user navigates back/forward within the session.
  const shuffleCacheRef = useRef<Record<string, QuizOption[]>>({});

  const resolved = useMemo(() => {
    if (!currentQuestion) return null;
    const base = resolveQuestion(currentQuestion, answers);
    if (!currentQuestion.randomize) return base;

    let shuffled = shuffleCacheRef.current[currentQuestion.id];
    if (!shuffled) {
      shuffled = [...base.options].sort(() => Math.random() - 0.5);
      shuffleCacheRef.current[currentQuestion.id] = shuffled;
    }
    return { ...base, options: shuffled };
  }, [currentQuestion, answers]);

  function next() {
    if (isQuestionStep && currentQuestion) {
      const ans = answers[currentQuestion.id];
      if (currentQuestion.type === "multi") {
        const arr = Array.isArray(ans) ? ans : [];
        if (arr.length === 0) {
          setError("მონიშნე მინიმუმ ერთი პასუხი.");
          return;
        }
      } else {
        if (!ans || (Array.isArray(ans) && ans.length === 0)) {
          setError("გთხოვ, წინ გადასასვლელად პასუხი აირჩიო.");
          return;
        }
      }
      track("quiz_step_completed", { step: step + 1, qid: currentQuestion.id });
    }
    setError(null);
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function selectSingle(optionKey: string) {
    if (!currentQuestion) return;
    setAnswers((a) => ({ ...a, [currentQuestion.id]: optionKey }));
    setError(null);
  }

  function toggleMulti(optionKey: string) {
    if (!currentQuestion) return;
    const qid = currentQuestion.id;
    const isQ10 = qid === "q10";

    setAnswers((a) => {
      const current = Array.isArray(a[qid]) ? (a[qid] as string[]) : [];
      let nextArr: string[];

      if (isQ10 && optionKey === Q10_UNKNOWN_KEY) {
        // Selecting "არ ვიცით" → keep only it OR deselect
        nextArr = current.includes(optionKey) ? [] : [optionKey];
      } else if (isQ10 && current.includes(Q10_UNKNOWN_KEY)) {
        // Adding any other option → drop "არ ვიცით"
        nextArr = [optionKey];
      } else {
        // Standard toggle
        nextArr = current.includes(optionKey)
          ? current.filter((k) => k !== optionKey)
          : [...current, optionKey];
      }

      const next: Answers = { ...a, [qid]: nextArr };
      // Clear dependent answers when source changes
      if (qid === "q2") delete next["q2b"];
      if (qid === "q10") delete next["q10b"];
      return next;
    });
    setError(null);
  }

  function validateLead(): boolean {
    const errs: Partial<Record<keyof Lead, string>> = {};
    if (!lead.name.trim()) errs.name = "სახელი აუცილებელია";
    if (!lead.email.trim()) errs.email = "ელფოსტა აუცილებელია";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))
      errs.email = "შეიყვანე ვალიდური ელფოსტა";
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
        {currentQuestion && resolved ? (
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
              კითხვა {currentQuestion.number} / {quizQuestions.length}
            </p>
            <h2 className="mt-2 text-xl md:text-2xl font-semibold leading-snug">
              {resolved.title}
            </h2>
            {resolved.helperText && (
              <p className="mt-2 text-sm text-ink-muted">{resolved.helperText}</p>
            )}
            <ul className="mt-6 space-y-2">
              {resolved.options.map((o) => {
                const ans = answers[currentQuestion.id];
                const selected =
                  currentQuestion.type === "multi"
                    ? Array.isArray(ans) && ans.includes(o.key)
                    : ans === o.key;
                const isMulti = currentQuestion.type === "multi";
                return (
                  <li key={o.key}>
                    <button
                      type="button"
                      onClick={() =>
                        isMulti ? toggleMulti(o.key) : selectSingle(o.key)
                      }
                      className={[
                        "w-full text-left rounded-lg border px-4 py-3 transition flex items-start gap-3",
                        selected
                          ? "border-accent bg-accent text-[#170303] font-medium"
                          : "border-line bg-[#1f0404] text-ink-soft hover:border-ink/60 hover:text-ink",
                      ].join(" ")}
                    >
                      {isMulti && (
                        <span
                          aria-hidden
                          className={[
                            "mt-[3px] h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition",
                            selected
                              ? "border-[#170303] bg-[#170303]"
                              : "border-ink-muted bg-transparent",
                          ].join(" ")}
                        >
                          {selected && (
                            <svg
                              viewBox="0 0 12 12"
                              className="h-3 w-3 text-accent"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                            </svg>
                          )}
                        </span>
                      )}
                      <span className="block text-sm leading-relaxed">{o.label}</span>
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
              სად გამოგიგზავნოთ მინი ანგარიში?
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              შედეგს გაჩვენებთ ეკრანზეც და გამოგიგზავნით ელფოსტაზეც, რომ შემდეგ
              დაბრუნება შეძლოთ.
            </p>

            <div className="mt-6 grid gap-4">
              <Field
                label="სახელი და გვარი *"
                value={lead.name}
                onChange={(v) => setLead({ ...lead, name: v })}
                error={leadErrors.name}
              />
              <Field
                label="ელ-ფოსტა *"
                type="email"
                value={lead.email}
                onChange={(v) => setLead({ ...lead, email: v })}
                error={leadErrors.email}
              />
              <Field
                label="ტელეფონის ნომერი (არასავალდებულო)"
                type="tel"
                value={lead.phone}
                onChange={(v) => setLead({ ...lead, phone: v })}
              />
              <Field
                label="კომპანიის სახელწოდება (არასავალდებულო)"
                value={lead.company}
                onChange={(v) => setLead({ ...lead, company: v })}
              />

              <label className="mt-2 flex items-start gap-3 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={lead.consent}
                  onChange={(e) => setLead({ ...lead, consent: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-line"
                />
                <span>
                  ვეთანხმები, რომ Mini Marketing MRI-ის შედეგები და დაკავშირებული
                  რეკომენდაციები ელფოსტაზე მივიღო.
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
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              disabled={submitting}
              className="btn-ghost"
            >
              ← უკან
            </button>
          ) : (
            <span />
          )}
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
              {submitting ? "იგზავნება..." : "შედეგის ნახვა"}
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-ink-muted">
        ეს არ არის სრული Marketing MRI — ეს საწყისი დიაგნოსტიკაა.
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
