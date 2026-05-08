import { NextResponse } from "next/server";
import { submissionSchema } from "@/lib/validation";
import { computeScore } from "@/lib/scoring";
import { getServerSupabase } from "@/lib/supabase";
import { sendDiagnosticEmail, sendAdminNotification } from "@/lib/email";

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
    phone: data.phone || null,
    company: data.company || null,
    answers: data.answers,
    business_type: result.businessType ?? null,
    sales_method: result.salesMethod ?? null,
    sales_methods: result.salesMethods ?? null,
    primary_sales_method: result.salesMethod ?? null,
    monthly_potential_customers: result.monthlyPotentialCustomers ?? null,
    average_sale_value: result.averageSaleValue ?? null,
    lost_investment_risk_score: result.lostInvestmentRiskScore,
    problem_visibility_score: result.problemVisibilityScore,
    mri_readiness_score: result.mriReadinessScore,
    risk_label: result.riskLabel,
    visibility_label: result.visibilityLabel,
    readiness_label: result.readinessLabel,
    suspected_loss_point: result.suspectedLossPoint,
    suspected_loss_points: result.suspectedLossPoints ?? null,
    primary_suspected_loss_point: result.primarySuspectedLossPoint ?? null,
    result_summary: {
      title: result.lossPoint.title,
      diagnosis: result.lossPoint.diagnosis,
      meanings: result.lossPoint.meanings,
      checks: result.lossPoint.checks,
      seven_day_action: result.lossPoint.sevenDayAction,
      risk_explanation: result.riskExplanation,
      visibility_explanation: result.visibilityExplanation,
      readiness_explanation: result.readinessExplanation,
    },
    source: "mini_marketing_mri_v2",
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

  try {
    await sendAdminNotification({
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      company: data.company || "",
      answers: data.answers,
      result,
    });
  } catch (e) {
    console.error("[quiz/submit] admin notification failed", e);
  }

  return NextResponse.json({ id: row.id });
}
