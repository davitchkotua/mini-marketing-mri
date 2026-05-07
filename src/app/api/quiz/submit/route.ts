import { NextResponse } from "next/server";
import { submissionSchema } from "@/lib/validation";
import { computeScore } from "@/lib/scoring";
import { getServerSupabase } from "@/lib/supabase";
import { sendDiagnosticEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const result = computeScore(data.answers);

  const supabase = getServerSupabase();

  const insert = {
    name: data.name,
    email: data.email,
    company: data.company,
    role: data.role,
    website: data.website || null,
    revenue_range: data.revenue_range || null,
    team_size: data.team_size || null,
    answers: data.answers,
    dimension_scores: result.dimensionScores,
    total_score: result.totalScore,
    percentage: result.percentage,
    health_level: result.healthLevel,
    primary_bottleneck: result.primaryBottleneck.key,
    result_summary: {
      title: result.primaryBottleneck.title,
      diagnosis: result.primaryBottleneck.diagnosis,
      symptoms: result.primaryBottleneck.symptoms,
      next_step: result.primaryBottleneck.nextStep,
      recommended_tier: result.recommendedTier,
      recommended_copy: result.recommendedCopy,
      health_interpretation: result.healthInterpretation,
    },
    source: "mini_marketing_mri_quiz",
    utm_source: data.utm?.utm_source ?? null,
    utm_medium: data.utm?.utm_medium ?? null,
    utm_campaign: data.utm?.utm_campaign ?? null,
    utm_content: data.utm?.utm_content ?? null,
    utm_term: data.utm?.utm_term ?? null,
  };

  const { data: row, error } = await supabase
    .from("quiz_submissions")
    .insert(insert)
    .select("id")
    .single();

  if (error || !row) {
    console.error("[quiz/submit] supabase insert failed", error);
    return NextResponse.json({ error: "Storage failed" }, { status: 500 });
  }

  try {
    await sendDiagnosticEmail({ to: data.email, name: data.name, result });
    await supabase
      .from("quiz_submissions")
      .update({ email_sent: true })
      .eq("id", row.id);
  } catch (e) {
    console.error("[quiz/submit] email send failed", e);
  }

  return NextResponse.json({ id: row.id });
}
