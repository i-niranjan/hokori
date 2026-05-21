import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.ACCESS_SECRET;

interface payload {
  id: string;
  email: string;
}
interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT Keys are not defined!");
}

export function generateToken(payload: payload): TokenPair {
  const accessToken = jwt.sign(payload, ACCESS_SECRET as string, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET as string, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET as string) as payload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET as string) as payload;
}
