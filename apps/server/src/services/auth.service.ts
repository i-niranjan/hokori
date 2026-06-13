import { hashSync, compare } from "bcrypt-ts";

import { isEmail } from "../utils/helper.js";
import prisma from "../lib/prisma.js";

export class AuthService {
  async assertSignupAvailable({
    email,
    userName,
  }: {
    email: string;
    userName: string;
  }) {
    const [existingEmailUser, existingUsernameUser] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { userName } }),
    ]);

    const fields: { email?: string; userName?: string } = {};
    if (existingEmailUser) {
      fields.email = "You already have an account with this email";
    }
    if (existingUsernameUser) {
      fields.userName = "This username is already taken";
    }

    if (Object.keys(fields).length > 0) {
      throw {
        status: 409,
        message: "Some details are already in use",
        fields,
      };
    }
  }

  async signUp({
    email,
    password,
    ...data
  }: {
    email: string;
    password: string;
    userName: string;
    firstName: string;
    lastName: string;
  }) {
    await this.assertSignupAvailable({ email, userName: data.userName });
    const hashedPassword = hashSync(password, 10);
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        emailVerified: true,
        ...data,
      },
    });
  }

  async login({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) {
    const isLoginWithEmail = isEmail(identifier);
    const user = await prisma.user.findUnique({
      where: isLoginWithEmail
        ? { email: identifier }
        : { userName: identifier },
    });

    if (!user) {
      throw { status: 400, message: "User not found" };
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw { status: 401, message: "Invalid password" };
    }

    return user;
  }
}
