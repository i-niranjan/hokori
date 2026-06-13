import { randomInt } from "crypto";
import { hashSync, compare } from "bcrypt-ts";
import prisma from "../lib/prisma.js";
import { sendOtpEmail } from "../lib/mailer.js";

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

export const otpService = {
  /** Generates, stores (hashed) and emails a 6-digit code. */
  requestOtp: async (email: string, firstName = "there"): Promise<void> => {
    const existing = await prisma.emailOtp.findUnique({ where: { email } });
    if (
      existing &&
      Date.now() - existing.lastSentAt.getTime() < RESEND_COOLDOWN_MS
    ) {
      throw {
        status: 429,
        message: "Please wait a minute before requesting another code",
      };
    }

    const code = String(randomInt(100000, 1000000));
    const codeHash = hashSync(code, 10);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await prisma.emailOtp.upsert({
      where: { email },
      update: { codeHash, expiresAt, attempts: 0, lastSentAt: new Date() },
      create: { email, codeHash, expiresAt },
    });

    await sendOtpEmail(email, code, firstName);
  },

  /** Throws on any failure; deletes the OTP row on success. */
  verifyOtp: async (email: string, code: string): Promise<void> => {
    const otp = await prisma.emailOtp.findUnique({ where: { email } });
    if (!otp) {
      throw { status: 400, message: "No code requested for this email" };
    }
    if (otp.expiresAt.getTime() < Date.now()) {
      throw { status: 400, message: "This code has expired, request a new one" };
    }
    if (otp.attempts >= MAX_ATTEMPTS) {
      throw {
        status: 429,
        message: "Too many attempts, request a new code",
      };
    }

    const valid = await compare(code, otp.codeHash);
    if (!valid) {
      await prisma.emailOtp.update({
        where: { email },
        data: { attempts: { increment: 1 } },
      });
      throw { status: 400, message: "That code isn't right, try again" };
    }

    await prisma.emailOtp.delete({ where: { email } });
  },
};
