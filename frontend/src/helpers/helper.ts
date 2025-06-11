export const isTokenExpired = (token: string) => {
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return exp < Math.floor(Date.now() / 1000);
  } catch (e) {
    return true;
  }
};
