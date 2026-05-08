import { Resend } from "resend";
import type { ScoreResult } from "./scoring";

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
<html lang="ka"><body style="margin:0;background:#170303;font-family:'Noto Sans Georgian',Inter,system-ui,sans-serif;color:#FFFFFF;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;background:#170303;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#1f0404;border:1px solid #333333;border-radius:12px;padding:32px;">
        <tr><td>
          <p style="margin:0 0 12px 0;font-size:12px;color:#6B6B6B;letter-spacing:.18em;text-transform:uppercase;">Mini Marketing MRI · საწყისი დიაგნოსტიკა</p>
          <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;color:#FFFFFF;">გამარჯობა, ${escape(name)}</h1>
          <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#D4D4D4;">მადლობა Mini Marketing MRI-ის შევსებისთვის. ქვემოთ არის შენი საწყისი დიაგნოსტიკა. ეს არ არის სრული Marketing MRI, მაგრამ გეხმარება დაინახო, სად შეიძლება იწყებოდეს პრობლემა.</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #333333;border-radius:10px;padding:0;margin:0 0 24px 0;">
            <tr>
              <td style="padding:14px 16px;border-bottom:1px solid #333333;">
                <span style="font-size:13px;color:#D4D4D4;">დაკარგული ინვესტიციის რისკი</span><br>
                <span style="font-size:18px;font-weight:600;color:#FFB21A;">${result.lostInvestmentRiskScore}% · ${escape(result.riskLabel)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 16px;border-bottom:1px solid #333333;">
                <span style="font-size:13px;color:#D4D4D4;">პრობლემის ხილვადობა</span><br>
                <span style="font-size:18px;font-weight:600;color:#FFFFFF;">${result.problemVisibilityScore}% · ${escape(result.visibilityLabel)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 16px;">
                <span style="font-size:13px;color:#D4D4D4;">Marketing MRI-სთვის მზადყოფნა</span><br>
                <span style="font-size:18px;font-weight:600;color:#FFFFFF;">${result.mriReadinessScore}% · ${escape(result.readinessLabel)}</span>
              </td>
            </tr>
          </table>

          <h2 style="margin:0 0 8px 0;font-size:18px;color:#FFFFFF;">${escape(result.lossPoint.title)}</h2>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#D4D4D4;">${escape(result.lossPoint.diagnosis)}</p>

          <p style="margin:0 0 8px 0;font-size:12px;color:#6B6B6B;text-transform:uppercase;letter-spacing:.14em;">3 პრაქტიკული შემოწმება</p>
          <ul style="margin:0 0 20px 18px;padding:0;font-size:15px;line-height:1.6;color:#D4D4D4;">${checks}</ul>

          <div style="border:1px solid rgba(255,178,26,0.3);background:rgba(255,178,26,0.05);border-radius:10px;padding:16px;margin:0 0 24px 0;">
            <p style="margin:0 0 6px 0;font-size:12px;color:#FFB21A;text-transform:uppercase;letter-spacing:.14em;">7-დღიანი მოქმედება</p>
            <p style="margin:0;font-size:15px;line-height:1.6;color:#FFFFFF;">${escape(result.lossPoint.sevenDayAction)}</p>
          </div>

          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#D4D4D4;">თუ გინდა, ეს შედეგი უფრო ღრმად გავშალოთ და გავიგოთ, სად იწყება რეალური პრობლემა, დაჯავშნე დიაგნოსტიკური ზარი.</p>

          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <a href="${bookUrl}" style="display:inline-block;background:#FFB21A;color:#170303;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:15px;font-weight:600;">დაჯავშნე დიაგნოსტიკური ზარი</a>
              </td>
            </tr>
          </table>

          <p style="margin:24px 0 0 0;font-size:12px;color:#6B6B6B;line-height:1.6;">ეს არის საწყისი დიაგნოსტიკა და არა სრული Marketing MRI.</p>
          <p style="margin:12px 0 0 0;font-size:13px;color:#6B6B6B;">Davit Chkotua / Marketing Architect Studio</p>
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
