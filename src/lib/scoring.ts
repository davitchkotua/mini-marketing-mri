// Mini Marketing MRI v2 — score computation + suspected loss point.
import {
  quizQuestions,
  type QuizOption,
  type QuizQuestion,
  type SuspectedLossPoint,
} from "./quiz-data";
import { lossPointPriority, lossPoints, type LossPointResult } from "./bottlenecks";

export type Answers = Record<string, string>;

export interface ScoreResult {
  lostInvestmentRiskScore: number;
  problemVisibilityScore: number;
  mriReadinessScore: number;
  riskLabel: string;
  visibilityLabel: string;
  readinessLabel: string;
  suspectedLossPoint: SuspectedLossPoint;
  lossPoint: LossPointResult;
  riskExplanation: string;
  visibilityExplanation: string;
  readinessExplanation: string;
  businessType?: string;
  salesMethod?: string;
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

function findOption(
  qid: string,
  optionKey: string
): { question: QuizQuestion; option: QuizOption } | null {
  const q = quizQuestions.find((x) => x.id === qid);
  if (!q) return null;
  const o = q.options.find((x) => x.key === optionKey);
  if (!o) return null;
  return { question: q, option: o };
}

function determineSuspectedLossPoint(answers: Answers): SuspectedLossPoint {
  // Q10 explicit answer takes priority unless it's "არ ვიცით" (key A).
  const q10 = answers["q10"];
  if (q10 && q10 !== "A") {
    const pair = findOption("q10", q10);
    if (pair?.option.suspectedLossPoint) return pair.option.suspectedLossPoint;
  }

  // Otherwise: collect candidates from weak signals (answer A or B) on diagnostic questions.
  const candidates = new Set<SuspectedLossPoint>();
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

  for (const { qid, lossPoint } of weaknessMap) {
    const ans = answers[qid];
    if (ans === "A" || ans === "B") candidates.add(lossPoint);
  }

  for (const lp of lossPointPriority) {
    if (candidates.has(lp)) return lp;
  }

  // Default fallback.
  return "CONTROL_SYSTEM";
}

export function computeScore(answers: Answers): ScoreResult {
  let risk = 40;
  let visibility = 50;
  let readiness = 40;

  let businessType: string | undefined;
  let salesMethod: string | undefined;
  let monthlyPotentialCustomers: string | undefined;
  let averageSaleValue: string | undefined;

  for (const q of quizQuestions) {
    const ans = answers[q.id];
    if (!ans) continue;
    const option = q.options.find((o) => o.key === ans);
    if (!option) continue;

    if (q.contextField === "business_type") businessType = option.contextValue;
    if (q.contextField === "sales_method") salesMethod = option.contextValue;
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

  risk = clamp(risk);
  visibility = clamp(visibility);
  readiness = clamp(readiness);

  const suspectedLossPoint = determineSuspectedLossPoint(answers);
  const lossPoint = lossPoints[suspectedLossPoint];

  return {
    lostInvestmentRiskScore: risk,
    problemVisibilityScore: visibility,
    mriReadinessScore: readiness,
    riskLabel: getRiskLabel(risk),
    visibilityLabel: getVisibilityLabel(visibility),
    readinessLabel: getReadinessLabel(readiness),
    suspectedLossPoint,
    lossPoint,
    riskExplanation: getRiskExplanation(risk),
    visibilityExplanation: getVisibilityExplanation(visibility),
    readinessExplanation: getReadinessExplanation(readiness),
    businessType,
    salesMethod,
    monthlyPotentialCustomers,
    averageSaleValue,
  };
}
