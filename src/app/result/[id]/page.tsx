import { notFound } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase";
import { ResultView } from "@/components/ResultView";
import { lossPoints } from "@/lib/bottlenecks";
import {
  getReadinessExplanation,
  getReadinessLabel,
  getRiskExplanation,
  getRiskLabel,
  getVisibilityExplanation,
  getVisibilityLabel,
} from "@/lib/scoring";
import type { SuspectedLossPoint } from "@/lib/quiz-data";

export const dynamic = "force-dynamic";

interface ResultRow {
  id: string;
  name: string;
  lost_investment_risk_score: number | null;
  problem_visibility_score: number | null;
  mri_readiness_score: number | null;
  risk_label: string | null;
  visibility_label: string | null;
  readiness_label: string | null;
  suspected_loss_point: string | null;
  result_summary: {
    title?: string;
    diagnosis?: string;
    meanings?: string[];
    checks?: string[];
    seven_day_action?: string;
    risk_explanation?: string;
    visibility_explanation?: string;
    readiness_explanation?: string;
  } | null;
}

export default async function ResultPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("quiz_submissions")
    .select(
      "id,name,lost_investment_risk_score,problem_visibility_score,mri_readiness_score,risk_label,visibility_label,readiness_label,suspected_loss_point,result_summary"
    )
    .eq("id", params.id)
    .single<ResultRow>();

  if (error || !data) notFound();

  const bookCallUrl =
    process.env.BOOK_CALL_URL || "https://www.davitchkotua.com/#book-call";

  const riskScore = data.lost_investment_risk_score ?? 0;
  const visibilityScore = data.problem_visibility_score ?? 0;
  const readinessScore = data.mri_readiness_score ?? 0;
  const lossPointKey = (data.suspected_loss_point ?? "CONTROL_SYSTEM") as SuspectedLossPoint;
  const lp = lossPoints[lossPointKey] ?? lossPoints.CONTROL_SYSTEM;
  const summary = data.result_summary ?? {};

  return (
    <ResultView
      id={data.id}
      name={data.name}
      riskScore={riskScore}
      visibilityScore={visibilityScore}
      readinessScore={readinessScore}
      riskLabel={data.risk_label ?? getRiskLabel(riskScore)}
      visibilityLabel={data.visibility_label ?? getVisibilityLabel(visibilityScore)}
      readinessLabel={data.readiness_label ?? getReadinessLabel(readinessScore)}
      riskExplanation={
        summary.risk_explanation ?? getRiskExplanation(riskScore)
      }
      visibilityExplanation={
        summary.visibility_explanation ?? getVisibilityExplanation(visibilityScore)
      }
      readinessExplanation={
        summary.readiness_explanation ?? getReadinessExplanation(readinessScore)
      }
      lossPoint={{
        title: summary.title ?? lp.title,
        diagnosis: summary.diagnosis ?? lp.diagnosis,
        meanings: summary.meanings ?? lp.meanings,
        checks: summary.checks ?? lp.checks,
        sevenDayAction: summary.seven_day_action ?? lp.sevenDayAction,
      }}
      bookCallUrl={bookCallUrl}
    />
  );
}
