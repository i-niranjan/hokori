import { hashSync, compare } from "bcrypt-ts";

import { isEmail } from "../utils/helper.js";
import prisma from "../lib/prisma.js";

export class AuthService {
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
    const [existingEmailUser, existingUsernameUser] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { userName: data.userName } }),
    ]);

    const errors = [];

    if (existingEmailUser) errors.push("Email already exists");
    if (existingUsernameUser) errors.push("Username already taken");

    if (errors.length > 0) {
      throw new Error(errors.join(" | "));
    }

    const hashedPassword = hashSync(password, 10);
    return prisma.user.create({
      data: { email, password: hashedPassword, ...data },
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
