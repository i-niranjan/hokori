import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("JWT - Secret Key is not defined");
}

export function generateToken(payload: Object) {
  return jwt.sign(payload, SECRET as string, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET as string);
}
