import { MAX_SCORE, quizQuestions, type DimensionKey } from "./quiz-data";
import { bottleneckPriority, bottlenecks, type BottleneckResult } from "./bottlenecks";

export type Answers = Partial<Record<DimensionKey, number>>;

export type HealthLevel =
  | "Critical Leakage"
  | "Unstable Growth System"
  | "Partially Built Marketing Architecture"
  | "Strong Base, Needs Precision";

export interface ScoreResult {
  dimensionScores: Record<DimensionKey, number>;
  totalScore: number;
  percentage: number;
  healthLevel: HealthLevel;
  healthInterpretation: string;
  primaryBottleneck: BottleneckResult;
  recommendedTier: "triage_call" | "marketing_mri" | "precision_diagnosis";
  recommendedCopy: string;
}

export function getHealthLevel(score: number): {
  level: HealthLevel;
  interpretation: string;
} {
  if (score <= 7) {
    return {
      level: "Critical Leakage",
      interpretation:
        "მარკეტინგი დიდი ალბათობით სისტემურად არ მუშაობს. ბიზნესი შესაძლოა კარგავს ფულს ან ზრდის შესაძლებლობებს, რადგან კომერციული გზა არაა მკაფიო.",
    };
  }
  if (score <= 14) {
    return {
      level: "Unstable Growth System",
      interpretation:
        "მარკეტინგული აქტივობები არსებობს, მაგრამ სისტემა სუსტია. ნაწილები ცალკე მუშაობს და პროგნოზირებად ზრდას ვერ ქმნის.",
    };
  }
  if (score <= 21) {
    return {
      level: "Partially Built Marketing Architecture",
      interpretation:
        "გარკვეული სტრუქტურა გაქვთ, მაგრამ offer-ში, funnel-ში, conversion-ში, რიტმში ან გადაწყვეტილებებში ჯერ კიდევ ჩანს bottleneck-ები.",
    };
  }
  return {
    level: "Strong Base, Needs Precision",
    interpretation:
      "საფუძველი შედარებით ძლიერია. შემდეგი ნაბიჯი გენერული მარკეტინგი არ არის — საჭიროა ზუსტი დიაგნოსტიკა, პრიორიტეტიზაცია და ოპტიმიზაცია.",
  };
}

export function getRecommendation(score: number): {
  tier: ScoreResult["recommendedTier"];
  copy: string;
} {
  if (score <= 14) {
    return {
      tier: "triage_call",
      copy:
        "ამ ეტაპზე ყველაზე სასარგებლო იქნება მოკლე triage call, რომ გავიგოთ პრობლემა რეალურად offer-შია, funnel-ში, conversion-ში თუ operating rhythm-ში.",
    };
  }
  if (score <= 21) {
    return {
      tier: "marketing_mri",
      copy:
        "შენ უკვე გაქვს გარკვეული საფუძველი, მაგრამ სავარაუდოდ სისტემის რამდენიმე ნაწილი ერთმანეთს ბოლომდე არ უკავშირდება. აქ Marketing MRI-ს შეუძლია გაჩვენოს კონკრეტული bottleneck priority map.",
    };
  }
  return {
    tier: "precision_diagnosis",
    copy:
      "შენი საფუძველი შედარებით ძლიერია. შემდეგი ნაბიჯი generic marketing work არ არის — საჭიროა ზუსტი დიაგნოსტიკა და ოპტიმიზაციის პრიორიტეტები.",
  };
}

export function findPrimaryBottleneck(
  dimensionScores: Record<DimensionKey, number>
): BottleneckResult {
  let lowest = Infinity;
  for (const k of bottleneckPriority) {
    if (dimensionScores[k] < lowest) lowest = dimensionScores[k];
  }
  for (const k of bottleneckPriority) {
    if (dimensionScores[k] === lowest) return bottlenecks[k];
  }
  return bottlenecks.money_clarity;
}

export function computeScore(answers: Answers): ScoreResult {
  const dimensionScores = {} as Record<DimensionKey, number>;
  let total = 0;
  for (const q of quizQuestions) {
    const v = Number(answers[q.key] ?? 0);
    dimensionScores[q.key] = v;
    total += v;
  }
  const percentage = Math.round((total / MAX_SCORE) * 100);
  const { level, interpretation } = getHealthLevel(total);
  const { tier, copy } = getRecommendation(total);
  return {
    dimensionScores,
    totalScore: total,
    percentage,
    healthLevel: level,
    healthInterpretation: interpretation,
    primaryBottleneck: findPrimaryBottleneck(dimensionScores),
    recommendedTier: tier,
    recommendedCopy: copy,
  };
}
