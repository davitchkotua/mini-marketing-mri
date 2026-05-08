// Mini Marketing MRI v2.1 — score computation with multi-select support.
import {
  quizQuestions,
  Q2_OPTIONS,
  Q10_OPTIONS,
  Q10B_UNCERTAINTY_OPTIONS,
  type SuspectedLossPoint,
} from "./quiz-data";
import { lossPointPriority, lossPoints, type LossPointResult } from "./bottlenecks";

export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;

export interface ScoreResult {
  lostInvestmentRiskScore: number;
  problemVisibilityScore: number;
  mriReadinessScore: number;
  riskLabel: string;
  visibilityLabel: string;
  readinessLabel: string;
  suspectedLossPoint: SuspectedLossPoint;
  suspectedLossPoints: SuspectedLossPoint[] | "UNKNOWN";
  primarySuspectedLossPoint: SuspectedLossPoint;
  lossPoint: LossPointResult;
  riskExplanation: string;
  visibilityExplanation: string;
  readinessExplanation: string;
  businessType?: string;
  salesMethod?: string; // primary
  salesMethods?: string[]; // all selected
  monthlyPotentialCustomers?: string;
  averageSaleValue?: string;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

export function getRiskLabel(score: number): string {
  if (score <= 25) return "დაბალი";
  if (score <= 50) return "საშუალო";
  if (score <= 75) return "საშუალო-მაღალი";
  return "მაღალი";
}

export function getVisibilityLabel(score: number): string {
  if (score <= 25) return "დაბალი";
  if (score <= 50) return "ნაწილობრივი";
  if (score <= 75) return "კარგი";
  return "ძლიერი";
}

export function getReadinessLabel(score: number): string {
  if (score <= 25) return "ჯერ ადრეა";
  if (score <= 50) return "საჭიროა მონაცემების დალაგება";
  if (score <= 75) return "ღირს საწყისი განხილვა";
  return "მზადაა ღრმა დიაგნოსტიკისთვის";
}

export function getRiskExplanation(score: number): string {
  if (score >= 76)
    return "შენი პასუხების მიხედვით, არსებობს მაღალი რისკი, რომ მარკეტინგში ჩადებული ინვესტიციის ნაწილი იკარგება გაყიდვამდე გზაზე. ეს არ ნიშნავს ზუსტ ფინანსურ დანაკარგს, მაგრამ არის სიგნალი, რომ სისტემა უფრო ღრმად უნდა შემოწმდეს.";
  if (score >= 51)
    return "შენი პასუხების მიხედვით, მარკეტინგში ჩადებული ინვესტიციის ნაწილი შეიძლება იკარგებოდეს ერთ ან რამდენიმე ეტაპზე — მაგალითად, დაკავშირებიდან საუბრამდე, შეთავაზებამდე ან გაყიდვის დახურვამდე.";
  if (score >= 26)
    return "შენი პასუხების მიხედვით, სისტემა ნაწილობრივ ჩანს, მაგრამ ჯერ კიდევ არსებობს ადგილი, სადაც გაყიდვები ან ზრდის შანსი შეიძლება იკარგებოდეს.";
  return "შენი პასუხების მიხედვით, ძირითადი სისტემა შედარებით დალაგებულია. შემდეგი შესაძლებლობა უფრო ზუსტ გაუმჯობესებაშია, ვიდრე სრული გადაკეთების საჭიროებაში.";
}

export function getVisibilityExplanation(score: number): string {
  if (score <= 25)
    return "პრობლემა მხოლოდ ის არ არის, რომ რაღაც შეიძლება იკარგებოდეს. მთავარი რისკია, რომ ჯერ ზუსტად არ ჩანს სად იკარგება.";
  if (score <= 50)
    return "ზოგი ნაწილი ჩანს, მაგრამ სრული გაყიდვამდე გზა ჯერ ბოლომდე გამჭვირვალე არ არის.";
  if (score <= 75)
    return "სისტემის დიდი ნაწილი ჩანს, რაც უფრო ღრმა დიაგნოსტიკას უკვე უფრო ღირებულს ხდის.";
  return "გაქვს საკმარისი ხილვადობა, რომ საუბარი უკვე კონკრეტულ გაუმჯობესებაზე გადავიდეს.";
}

export function getReadinessExplanation(score: number): string {
  if (score <= 25)
    return "ამ ეტაპზე სრული Marketing MRI შეიძლება ნაადრევი იყოს. პირველ რიგში საჭიროა მინიმალური აღრიცხვა: საიდან მოდის პოტენციური კლიენტი, რა ეტაპზე ჩერდება და რატომ იკარგება.";
  if (score <= 50)
    return "სრული დიაგნოსტიკის წინ სასურველია რამდენიმე ძირითადი მონაცემის დალაგება. თუმცა საწყისი დიაგნოსტიკური ზარი დაგეხმარება, რა უნდა შეაგროვო პირველ რიგში.";
  if (score <= 75)
    return "შენი პასუხები აჩვენებს, რომ უკვე არსებობს საკმარისი სიგნალი საწყისი დიაგნოსტიკური განხილვისთვის.";
  return "შენი პასუხები აჩვენებს, რომ უფრო ღრმა Marketing MRI-სთვის საკმარისი საწყისი სიგნალი არსებობს.";
}

function asArray(v: AnswerValue | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function asString(v: AnswerValue | undefined): string | undefined {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

/**
 * Determine the primary suspected loss point.
 * Priority: q10b answer (concrete or uncertainty branch).
 * Fallback: weak signals from diagnostic questions.
 */
function determinePrimaryLossPoint(answers: Answers): SuspectedLossPoint {
  const q10 = asArray(answers["q10"]);
  const q10b = asString(answers["q10b"]);

  if (q10b) {
    const isUnknownBranch = q10.includes("F");
    const opts = isUnknownBranch ? Q10B_UNCERTAINTY_OPTIONS : Q10_OPTIONS;
    const opt = opts.find((o) => o.key === q10b);
    if (opt?.suspectedLossPoint) return opt.suspectedLossPoint;
  }

  // Fallback: derive from concrete q10 selections (if user skipped q10b somehow)
  for (const lp of lossPointPriority) {
    for (const key of q10) {
      const opt = Q10_OPTIONS.find((o) => o.key === key);
      if (opt?.suspectedLossPoint === lp) return lp;
    }
  }

  // Final fallback: weak-signal map across diagnostic questions
  const weaknessMap: Array<{ qid: string; lossPoint: SuspectedLossPoint }> = [
    { qid: "q5", lossPoint: "MONEY_SOURCE" },
    { qid: "q6", lossPoint: "CONTACT_TO_CONVERSATION" },
    { qid: "q7", lossPoint: "CONVERSATION_TO_OFFER" },
    { qid: "q8", lossPoint: "OFFER_TO_SALE" },
    { qid: "q11", lossPoint: "FOLLOW_UP" },
    { qid: "q12", lossPoint: "CONTROL_SYSTEM" },
    { qid: "q13", lossPoint: "CONTROL_SYSTEM" },
    { qid: "q14", lossPoint: "CONTROL_SYSTEM" },
  ];
  const candidates = new Set<SuspectedLossPoint>();
  for (const { qid, lossPoint } of weaknessMap) {
    const ans = asString(answers[qid]);
    if (ans === "A" || ans === "B") candidates.add(lossPoint);
  }
  for (const lp of lossPointPriority) {
    if (candidates.has(lp)) return lp;
  }
  return "CONTROL_SYSTEM";
}

export function computeScore(answers: Answers): ScoreResult {
  let risk = 55;
  let visibility = 50;
  let readiness = 40;

  let businessType: string | undefined;
  let monthlyPotentialCustomers: string | undefined;
  let averageSaleValue: string | undefined;

  // ─── Q2 / Q2b: sales methods ────────────────────────────────────────────────
  const q2Selected = asArray(answers["q2"]);
  const salesMethods = q2Selected
    .map((k) => Q2_OPTIONS.find((o) => o.key === k)?.contextValue)
    .filter((v): v is string => Boolean(v));

  const q2bKey = asString(answers["q2b"]);
  const salesMethod = q2bKey
    ? Q2_OPTIONS.find((o) => o.key === q2bKey)?.contextValue
    : undefined;

  // ─── Single-select questions: apply modifiers + capture context ─────────────
  for (const q of quizQuestions) {
    if (q.type !== "single") continue;
    // q2b and q10b have their own logic — skip modifier application here
    if (q.id === "q2b" || q.id === "q10b") continue;

    const ans = asString(answers[q.id]);
    if (!ans) continue;
    const option = q.options.find((o) => o.key === ans);
    if (!option) continue;

    if (q.contextField === "business_type") businessType = option.contextValue;
    if (q.contextField === "monthly_potential_customers")
      monthlyPotentialCustomers = option.contextValue;
    if (q.contextField === "average_sale_value")
      averageSaleValue = option.contextValue;

    if (option.modifier) {
      if (option.modifier.risk) risk += option.modifier.risk;
      if (option.modifier.visibility) visibility += option.modifier.visibility;
      if (option.modifier.readiness) readiness += option.modifier.readiness;
    }
  }

  // ─── Q10 multi-select scoring ───────────────────────────────────────────────
  const q10Selected = asArray(answers["q10"]);
  const isUnknownPath = q10Selected.includes("F");

  if (isUnknownPath) {
    visibility -= 25;
    risk += 20;
  } else if (q10Selected.length > 1) {
    // +5 risk per concrete loss point after the first, max +15
    const extra = Math.min(15, (q10Selected.length - 1) * 5);
    risk += extra;
  }

  risk = clamp(risk);
  visibility = clamp(visibility);
  readiness = clamp(readiness);

  // ─── Suspected loss points (multi) ──────────────────────────────────────────
  let suspectedLossPoints: SuspectedLossPoint[] | "UNKNOWN";
  if (isUnknownPath) {
    suspectedLossPoints = "UNKNOWN";
  } else {
    suspectedLossPoints = q10Selected
      .map((k) => Q10_OPTIONS.find((o) => o.key === k)?.suspectedLossPoint)
      .filter((v): v is SuspectedLossPoint => Boolean(v));
  }

  const primarySuspectedLossPoint = determinePrimaryLossPoint(answers);
  const lossPoint = lossPoints[primarySuspectedLossPoint];

  return {
    lostInvestmentRiskScore: risk,
    problemVisibilityScore: visibility,
    mriReadinessScore: readiness,
    riskLabel: getRiskLabel(risk),
    visibilityLabel: getVisibilityLabel(visibility),
    readinessLabel: getReadinessLabel(readiness),
    suspectedLossPoint: primarySuspectedLossPoint, // backward compat
    suspectedLossPoints,
    primarySuspectedLossPoint,
    lossPoint,
    riskExplanation: getRiskExplanation(risk),
    visibilityExplanation: getVisibilityExplanation(visibility),
    readinessExplanation: getReadinessExplanation(readiness),
    businessType,
    salesMethod,
    salesMethods,
    monthlyPotentialCustomers,
    averageSaleValue,
  };
}
