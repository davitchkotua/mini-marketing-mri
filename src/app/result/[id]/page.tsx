import { notFound } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase";
import { ResultView } from "@/components/ResultView";

export const dynamic = "force-dynamic";

interface ResultRow {
  id: string;
  name: string;
  total_score: number;
  percentage: number;
  health_level: string;
  result_summary: {
    title: string;
    diagnosis: string;
    symptoms: string[];
    next_step: string;
    recommended_copy: string;
    health_interpretation: string;
  };
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
      "id,name,total_score,percentage,health_level,result_summary"
    )
    .eq("id", params.id)
    .single<ResultRow>();

  if (error || !data) notFound();

  const bookCallUrl = process.env.BOOK_CALL_URL || "https://example.com/book-call";
  const fullMriUrl = process.env.FULL_MRI_URL || "https://example.com/marketing-mri";

  return (
    <ResultView
      id={data.id}
      name={data.name}
      totalScore={data.total_score}
      percentage={data.percentage}
      healthLevel={data.health_level}
      healthInterpretation={data.result_summary.health_interpretation}
      bottleneck={{
        title: data.result_summary.title,
        diagnosis: data.result_summary.diagnosis,
        symptoms: data.result_summary.symptoms,
        next_step: data.result_summary.next_step,
      }}
      recommendedCopy={data.result_summary.recommended_copy}
      bookCallUrl={bookCallUrl}
      fullMriUrl={fullMriUrl}
    />
  );
}
