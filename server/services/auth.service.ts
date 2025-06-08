import { hashSync, compare } from "bcrypt-ts";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class AuthService {
  async signUp(data: any) {
    const { email, password } = data;

    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      throw { status: 400, message: "Email already exists" };
    }

    const hashedPassword = hashSync(password, 10);
    data.password = hashedPassword;

    await prisma.user.create({ data });
    return { message: "User registered successfully" };
  }

  async login(data: any) {
    const { email, password } = data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw { status: 400, message: "Email doesn't exist" };
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      throw { status: 401, message: "Invalid credentials" };
    }

    return { message: "Login successful" };
  }
}
