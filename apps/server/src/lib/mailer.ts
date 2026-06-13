import nodemailer from "nodemailer";
import { env } from "./env.js";

const smtpConfigured =
  env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS;

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  : null;

const otpEmailHtml = (code: string, firstName: string) => `
<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background-color:#f6f3ed;">
    <div style="max-width:420px;margin:0 auto;background-color:#fffdf8;border:1px solid #e8e3d8;border-radius:8px;overflow:hidden;font-family:Georgia,'Times New Roman',serif;">
      <div style="padding:28px 32px 0;">
        <span style="font-size:22px;font-weight:600;color:#2b2823;">hokori<span style="color:#c2401c;">.</span></span>
      </div>
      <div style="padding:24px 32px 32px;">
        <p style="margin:0 0 6px;font-size:16px;color:#2b2823;">Hi ${firstName},</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#56524a;">
          Use this code to verify your email and finish creating your Hokori.
          It expires in 10 minutes.
        </p>
        <div style="margin:22px 0;padding:18px 0;text-align:center;background-color:#f6f3ed;border:1px solid #e8e3d8;border-radius:6px;">
          <span style="font-size:30px;letter-spacing:10px;font-weight:700;color:#2b2823;font-family:'Courier New',monospace;">${code}</span>
        </div>
        <p style="margin:0;font-size:12px;line-height:1.6;color:#8b857a;">
          Didn't create a Hokori account? You can safely ignore this email.
        </p>
      </div>
      <div style="padding:16px 32px;border-top:1px solid #e8e3d8;">
        <p style="margin:0;font-size:11px;color:#8b857a;">&copy; Hokori &mdash; Pride in your journey.</p>
      </div>
    </div>
  </body>
</html>`;

export async function sendOtpEmail(
  to: string,
  code: string,
  firstName: string
): Promise<void> {
  if (!transporter) {
    // Dev fallback so signup is testable without SMTP credentials.
    console.log(`[mailer] SMTP not configured — OTP for ${to}: ${code}`);
    return;
  }

  await transporter.sendMail({
    from: env.MAIL_FROM ?? `Hokori <${env.SMTP_USER}>`,
    to,
    subject: `${code} is your Hokori verification code`,
    text: `Hi ${firstName},\n\nYour Hokori verification code is ${code}. It expires in 10 minutes.\n\nDidn't create a Hokori account? You can safely ignore this email.`,
    html: otpEmailHtml(code, firstName),
  });
}
