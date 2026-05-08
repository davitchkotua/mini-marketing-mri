import { Resend } from "resend";
import type { ScoreResult } from "./scoring";
import { quizQuestions, Q10B_UNCERTAINTY_OPTIONS } from "./quiz-data";

interface SendArgs {
  to: string;
  name: string;
  result: ScoreResult;
}

export async function sendDiagnosticEmail({ to, name, result }: SendArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("Resend is not configured");
  }
  const resend = new Resend(apiKey);
  const bookUrl =
    process.env.BOOK_CALL_URL || "https://www.davitchkotua.com/#book-call";

  const subject =
    "შენი Mini Marketing MRI შედეგი — სად იკარგება მარკეტინგში ჩადებული ინვესტიცია";
  const html = renderHtml({ name, result, bookUrl });
  const text = renderText({ name, result, bookUrl });

  return resend.emails.send({ from, to, subject, html, text });
}

function renderText(args: {
  name: string;
  result: ScoreResult;
  bookUrl: string;
}) {
  const { name, result, bookUrl } = args;
  return `გამარჯობა, ${name}

მადლობა Mini Marketing MRI-ის შევსებისთვის. ქვემოთ არის შენი საწყისი დიაგნოსტიკა. ეს არ არის სრული Marketing MRI, მაგრამ გეხმარება დაინახო, სად შეიძლება იწყებოდეს პრობლემა.

— დაკარგული ინვესტიციის რისკი: ${result.lostInvestmentRiskScore}% — ${result.riskLabel}
— პრობლემის ხილვადობა: ${result.problemVisibilityScore}% — ${result.visibilityLabel}
— Marketing MRI-სთვის მზადყოფნა: ${result.mriReadinessScore}% — ${result.readinessLabel}

${result.lossPoint.title}

${result.lossPoint.diagnosis}

3 პრაქტიკული შემოწმება:
${result.lossPoint.checks.map((c, i) => `${i + 1}. ${c}`).join("\n")}

7-დღიანი მოქმედება:
${result.lossPoint.sevenDayAction}

თუ გინდა, ეს შედეგი უფრო ღრმად გავშალოთ და გავიგოთ, სად იწყება რეალური პრობლემა, დაჯავშნე დიაგნოსტიკური ზარი.

დაჯავშნე: ${bookUrl}

ეს არის საწყისი დიაგნოსტიკა და არა სრული Marketing MRI.

Davit Chkotua / Marketing Architect Studio`;
}

function renderHtml(args: {
  name: string;
  result: ScoreResult;
  bookUrl: string;
}) {
  const { name, result, bookUrl } = args;
  const checks = result.lossPoint.checks
    .map(
      (c, i) =>
        `<li style="margin:0 0 8px 0;"><strong style="color:#FFB21A;">${i + 1}.</strong> ${escape(c)}</li>`
    )
    .join("");

  return `<!doctype html>
<html lang="ka">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark only">
<meta name="supported-color-schemes" content="dark only">
<title>Mini Marketing MRI</title>
<style>
  :root { color-scheme: dark only; supported-color-schemes: dark only; }
  body, table, td, p, h1, h2, ul, li, a, span { -webkit-font-smoothing:antialiased; }
  /* Some clients (Apple Mail dark mode) auto-invert; lock our palette */
  [data-ogsc] body, [data-ogsb] body { background:#170303 !important; }
  @media (prefers-color-scheme: dark) {
    body, .body-bg { background:#170303 !important; }
  }
</style>
</head>
<body bgcolor="#170303" style="margin:0;padding:0;background:#170303;background-color:#170303;font-family:'Noto Sans Georgian','Helvetica Neue',Arial,sans-serif;color:#FFFFFF;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#170303" class="body-bg" style="background:#170303;background-color:#170303;padding:32px 0;">
    <tr><td align="center" bgcolor="#170303" style="background:#170303;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#1f0404" style="background:#1f0404;background-color:#1f0404;border:1px solid #3a1010;border-radius:12px;max-width:600px;width:100%;">
        <tr><td bgcolor="#1f0404" style="background:#1f0404;padding:32px;">
          <p style="margin:0 0 12px 0;font-size:12px;color:#9a8a8a;letter-spacing:.18em;text-transform:uppercase;">Mini Marketing MRI · საწყისი დიაგნოსტიკა</p>
          <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;color:#FFFFFF;font-weight:600;">გამარჯობა, ${escape(name)}</h1>
          <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#D4C4C4;">მადლობა Mini Marketing MRI-ის შევსებისთვის. ქვემოთ არის შენი საწყისი დიაგნოსტიკა. ეს არ არის სრული Marketing MRI, მაგრამ გეხმარება დაინახო, სად შეიძლება იწყებოდეს პრობლემა.</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#170303" style="background:#170303;background-color:#170303;border:1px solid #3a1010;border-radius:10px;margin:0 0 24px 0;">
            <tr>
              <td bgcolor="#170303" style="background:#170303;padding:14px 16px;border-bottom:1px solid #3a1010;">
                <div style="font-size:13px;color:#D4C4C4;margin-bottom:4px;">დაკარგული ინვესტიციის რისკი</div>
                <div style="font-size:18px;font-weight:600;color:#FFB21A;">${result.lostInvestmentRiskScore}% · ${escape(result.riskLabel)}</div>
              </td>
            </tr>
            <tr>
              <td bgcolor="#170303" style="background:#170303;padding:14px 16px;border-bottom:1px solid #3a1010;">
                <div style="font-size:13px;color:#D4C4C4;margin-bottom:4px;">პრობლემის ხილვადობა</div>
                <div style="font-size:18px;font-weight:600;color:#FFFFFF;">${result.problemVisibilityScore}% · ${escape(result.visibilityLabel)}</div>
              </td>
            </tr>
            <tr>
              <td bgcolor="#170303" style="background:#170303;padding:14px 16px;">
                <div style="font-size:13px;color:#D4C4C4;margin-bottom:4px;">Marketing MRI-სთვის მზადყოფნა</div>
                <div style="font-size:18px;font-weight:600;color:#FFFFFF;">${result.mriReadinessScore}% · ${escape(result.readinessLabel)}</div>
              </td>
            </tr>
          </table>

          <h2 style="margin:0 0 8px 0;font-size:18px;color:#FFFFFF;font-weight:600;">${escape(result.lossPoint.title)}</h2>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#D4C4C4;">${escape(result.lossPoint.diagnosis)}</p>

          <p style="margin:0 0 8px 0;font-size:12px;color:#9a8a8a;text-transform:uppercase;letter-spacing:.14em;">3 პრაქტიკული შემოწმება</p>
          <ul style="margin:0 0 20px 18px;padding:0;font-size:15px;line-height:1.6;color:#D4C4C4;">${checks}</ul>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#2a1208" style="background:#2a1208;background-color:#2a1208;border:1px solid #FFB21A;border-radius:10px;margin:0 0 24px 0;">
            <tr><td bgcolor="#2a1208" style="background:#2a1208;padding:16px;">
              <div style="font-size:12px;color:#FFB21A;text-transform:uppercase;letter-spacing:.14em;margin-bottom:6px;">7-დღიანი მოქმედება</div>
              <div style="font-size:15px;line-height:1.6;color:#FFFFFF;">${escape(result.lossPoint.sevenDayAction)}</div>
            </td></tr>
          </table>

          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#D4C4C4;">თუ გინდა, ეს შედეგი უფრო ღრმად გავშალოთ და გავიგოთ, სად იწყება რეალური პრობლემა, დაჯავშნე დიაგნოსტიკური ზარი.</p>

          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td bgcolor="#FFB21A" style="background:#FFB21A;background-color:#FFB21A;border-radius:8px;">
                <a href="${bookUrl}" style="display:inline-block;background:#FFB21A;color:#170303;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:15px;font-weight:600;mso-padding-alt:0;">დაჯავშნე დიაგნოსტიკური ზარი</a>
              </td>
            </tr>
          </table>

          <p style="margin:24px 0 0 0;font-size:12px;color:#9a8a8a;line-height:1.6;">ეს არის საწყისი დიაგნოსტიკა და არა სრული Marketing MRI.</p>
          <p style="margin:12px 0 0 0;font-size:13px;color:#9a8a8a;">Davit Chkotua / Marketing Architect Studio</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Admin notification ───────────────────────────────────────────────────────

interface AdminArgs {
  name: string;
  email: string;
  phone: string;
  company: string;
  answers: Record<string, string | string[]>;
  result: ScoreResult;
}

export async function sendAdminNotification(args: AdminArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;

  const resend = new Resend(apiKey);
  const { name, email, phone, company, answers, result } = args;

  // Resolve a key (or array of keys) to a human-readable label.
  const labelFor = (q: typeof quizQuestions[number], key: string): string => {
    // q10b uncertainty branch uses U1..U5 keys from a separate option pool.
    if (q.id === "q10b" && key.startsWith("U")) {
      return Q10B_UNCERTAINTY_OPTIONS.find((o) => o.key === key)?.label ?? key;
    }
    return q.options.find((o) => o.key === key)?.label ?? key;
  };

  // Build answers table rows. q10b's effective title may be the branched one.
  const answerRows = quizQuestions
    .map((q) => {
      const value = answers[q.id];
      let displayValue = "—";
      if (Array.isArray(value)) {
        displayValue = value.map((k) => labelFor(q, k)).join(" · ");
      } else if (typeof value === "string" && value) {
        displayValue = labelFor(q, value);
      }
      // Use the branched title for q10b when q10 = unknown
      let titleForRow = q.title;
      if (q.branchOnUnknown) {
        const src = answers[q.branchOnUnknown.qid];
        const arr = Array.isArray(src) ? src : src ? [src] : [];
        if (arr.includes(q.branchOnUnknown.unknownKey)) {
          titleForRow = q.branchOnUnknown.title;
        }
      }
      return `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #2a2a2a;font-size:13px;color:#9ca3af;width:45%">${escape(titleForRow)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #2a2a2a;font-size:13px;color:#ffffff">${escape(displayValue)}</td>
      </tr>`;
    })
    .join("");

  const html = `<!doctype html>
<html lang="ka"><body style="margin:0;background:#0f0f0f;font-family:Inter,system-ui,sans-serif;color:#fff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;background:#0f0f0f;">
    <tr><td align="center">
      <table role="presentation" width="620" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;padding:28px;">
        <tr><td>
          <p style="margin:0 0 4px 0;font-size:11px;color:#6b7280;letter-spacing:.16em;text-transform:uppercase;">Mini Marketing MRI — ახალი შევსება</p>
          <h1 style="margin:0 0 20px 0;font-size:20px;color:#fff;">${escape(name)}</h1>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a2a;border-radius:8px;margin:0 0 24px 0;">
            <tr><td style="padding:10px 14px;border-bottom:1px solid #2a2a2a;">
              <span style="font-size:12px;color:#9ca3af;">ელ-ფოსტა</span><br>
              <a href="mailto:${escape(email)}" style="font-size:15px;color:#FFB21A;text-decoration:none;">${escape(email)}</a>
            </td></tr>
            <tr><td style="padding:10px 14px;border-bottom:1px solid #2a2a2a;">
              <span style="font-size:12px;color:#9ca3af;">ტელეფონი</span><br>
              <span style="font-size:15px;color:#fff;">${escape(phone || "—")}</span>
            </td></tr>
            <tr><td style="padding:10px 14px;">
              <span style="font-size:12px;color:#9ca3af;">კომპანია</span><br>
              <span style="font-size:15px;color:#fff;">${escape(company || "—")}</span>
            </td></tr>
          </table>

          <p style="margin:0 0 8px 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.14em;">სკორები</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a2a;border-radius:8px;margin:0 0 24px 0;">
            <tr><td style="padding:8px 14px;border-bottom:1px solid #2a2a2a;font-size:13px;">
              დაკარგული ინვ. რისკი: <strong style="color:#FFB21A;">${result.lostInvestmentRiskScore}% · ${escape(result.riskLabel)}</strong>
            </td></tr>
            <tr><td style="padding:8px 14px;border-bottom:1px solid #2a2a2a;font-size:13px;">
              პრობლემის ხილვადობა: <strong>${result.problemVisibilityScore}% · ${escape(result.visibilityLabel)}</strong>
            </td></tr>
            <tr><td style="padding:8px 14px;border-bottom:1px solid #2a2a2a;font-size:13px;">
              MRI მზადყოფნა: <strong>${result.mriReadinessScore}% · ${escape(result.readinessLabel)}</strong>
            </td></tr>
            <tr><td style="padding:8px 14px;font-size:13px;">
              პირველი ზონა: <strong style="color:#FFB21A;">${escape(result.lossPoint.title)}</strong>
            </td></tr>
          </table>

          <p style="margin:0 0 8px 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.14em;">პასუხები</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a2a;border-radius:8px;margin:0 0 16px 0;">
            ${answerRows}
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return resend.emails.send({
    from,
    to: "hello@davitchkotua.com",
    subject: "mini Marketing MRI კლიენტი",
    html,
  });
}
