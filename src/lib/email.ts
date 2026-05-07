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
  const bookUrl = process.env.BOOK_CALL_URL || "https://example.com/book-call";
  const mriUrl = process.env.FULL_MRI_URL || "https://example.com/marketing-mri";

  const subject = "შენი Mini Marketing MRI შედეგი";
  const html = renderHtml({ name, result, bookUrl, mriUrl });
  const text = renderText({ name, result, bookUrl, mriUrl });

  return resend.emails.send({ from, to, subject, html, text });
}

function renderText(args: {
  name: string;
  result: ScoreResult;
  bookUrl: string;
  mriUrl: string;
}) {
  const { name, result, bookUrl, mriUrl } = args;
  return `გამარჯობა, ${name}

მადლობა Mini Marketing MRI Quiz-ის შევსებისთვის. ქვემოთ არის შენი საწყისი diagnostic-lite შედეგი. ეს არ არის სრული Marketing MRI, მაგრამ გეხმარება დაინახო სად შეიძლება იწყებოდეს მთავარი კომერციული bottleneck.

ქულა: ${result.totalScore}/28 (${result.percentage}%)
Health level: ${result.healthLevel}
Primary bottleneck: ${result.primaryBottleneck.title}

${result.primaryBottleneck.diagnosis}

სიმპტომები:
${result.primaryBottleneck.symptoms.map((s) => `- ${s}`).join("\n")}

რეკომენდირებული შემდეგი ნაბიჯი:
${result.recommendedCopy}

დაჯავშნე Marketing Architects Call: ${bookUrl}
მოითხოვე Full Marketing MRI: ${mriUrl}

Davit Chkotua / Marketing Architect Studio`;
}

function renderHtml(args: {
  name: string;
  result: ScoreResult;
  bookUrl: string;
  mriUrl: string;
}) {
  const { name, result, bookUrl, mriUrl } = args;
  const symptoms = result.primaryBottleneck.symptoms
    .map((s) => `<li style="margin:0 0 6px 0;">${escape(s)}</li>`)
    .join("");
  return `<!doctype html>
<html lang="ka"><body style="margin:0;background:#F7F5F0;font-family:'Noto Sans Georgian',Inter,system-ui,sans-serif;color:#0B0F14;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #E5E1D8;border-radius:12px;padding:32px;">
        <tr><td>
          <p style="margin:0 0 16px 0;font-size:14px;color:#5B6470;letter-spacing:.08em;text-transform:uppercase;">Mini Marketing MRI</p>
          <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;">გამარჯობა, ${escape(name)}</h1>
          <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;">მადლობა Mini Marketing MRI Quiz-ის შევსებისთვის. ქვემოთ არის შენი საწყისი diagnostic-lite შედეგი. ეს არ არის სრული Marketing MRI, მაგრამ გეხმარება დაინახო სად შეიძლება იწყებოდეს მთავარი კომერციული bottleneck.</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E1D8;border-radius:10px;padding:16px;margin:0 0 20px 0;">
            <tr><td style="font-size:14px;color:#5B6470;">ქულა</td><td align="right" style="font-size:16px;font-weight:600;">${result.totalScore}/28 · ${result.percentage}%</td></tr>
            <tr><td style="font-size:14px;color:#5B6470;padding-top:6px;">Health level</td><td align="right" style="font-size:16px;font-weight:600;padding-top:6px;">${escape(result.healthLevel)}</td></tr>
          </table>

          <h2 style="margin:0 0 8px 0;font-size:18px;">${escape(result.primaryBottleneck.title)}</h2>
          <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;">${escape(result.primaryBottleneck.diagnosis)}</p>
          <ul style="margin:0 0 16px 18px;padding:0;font-size:15px;line-height:1.6;">${symptoms}</ul>

          <p style="margin:0 0 8px 0;font-size:14px;color:#5B6470;text-transform:uppercase;letter-spacing:.08em;">რეკომენდირებული შემდეგი ნაბიჯი</p>
          <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;">${escape(result.recommendedCopy)}</p>

          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:8px;">
                <a href="${bookUrl}" style="display:inline-block;background:#0E5B4F;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-size:15px;">დაჯავშნე Marketing Architects Call</a>
              </td>
              <td>
                <a href="${mriUrl}" style="display:inline-block;background:#ffffff;color:#0B0F14;text-decoration:none;padding:12px 18px;border-radius:8px;font-size:15px;border:1px solid #0B0F14;">მოითხოვე Full Marketing MRI</a>
              </td>
            </tr>
          </table>

          <p style="margin:24px 0 0 0;font-size:12px;color:#5B6470;line-height:1.6;">ეს არის საწყისი diagnostic-lite assessment და არა სრული Marketing MRI.</p>
          <p style="margin:16px 0 0 0;font-size:13px;color:#5B6470;">Davit Chkotua / Marketing Architect Studio</p>
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
