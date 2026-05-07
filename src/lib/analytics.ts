export type AnalyticsEvent =
  | "quiz_started"
  | "quiz_step_completed"
  | "quiz_submitted"
  | "result_viewed"
  | "call_cta_clicked"
  | "mri_cta_clicked";

export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(`[analytics] ${event}`, payload);
  }
  // Replace with real analytics provider integration later.
}
