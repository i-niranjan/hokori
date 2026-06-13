export const getInitials = (fullname: string) => {
  return fullname
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
};
