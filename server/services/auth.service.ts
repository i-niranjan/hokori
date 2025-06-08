import { hashSync } from "bcrypt-ts";
import { PrismaClient } from "@prisma/client";
import { Jwt } from "jsonwebtoken";
import { Request, Response } from "express";
const prisma = new PrismaClient();

class AuthService {
  async signUp(req: Request, res: Response) {
    try {
      const data = req.body;
      const { userName, email, password } = req.body;

      const [emailExists, userNameExists] = await Promise.all([
        await prisma.user.findUnique({ where: { email } }),
        await prisma.user.findUnique({
          where: { userName },
        }),
      ]);
      if (userNameExists && emailExists) {
        return res
          .status(400)
          .json({ message: "Username & email already exists" });
      } else if (userNameExists)
        return res.status(400).json({ message: "Username already exists" });
      else if (emailExists)
        return res.status(400).json({ message: "Email already exists" });

      data.password = hashSync(password, 10);

      await prisma.user.create({ data });
      res.status(201).json({ message: "User registered successfully" });
    } catch (error: unknown) {
      // WIP - Build A Error Handler
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Something went wrong");
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password };
    } catch (error) {}
  }
}
