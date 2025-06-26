import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string) => {
  const decoded: { exp: number } = jwtDecode(token);
  const isTokenExpired = Date.now() >= decoded.exp * 1000;
  return isTokenExpired;
};
