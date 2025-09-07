import { Request } from "express";
interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export { AuthRequest };
