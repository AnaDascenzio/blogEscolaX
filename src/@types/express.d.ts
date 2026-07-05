import { UserRole } from "../api/entities/enums/user-roles.enum";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: UserRole;
      };
    }
  }
}

export {};
