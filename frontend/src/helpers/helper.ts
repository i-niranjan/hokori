import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string) => {
  if (!token) return true;
  const decoded: { exp: number } = jwtDecode(token);
  const isTokenExpired = Date.now() >= decoded.exp * 1000;
  return isTokenExpired;
};

export const getInitials = (fullname: string) => {
  return fullname
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
};
