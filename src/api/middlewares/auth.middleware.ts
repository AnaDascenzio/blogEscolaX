import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/user.repository";
import { UserRole } from "../entities/enums/user-roles.enum";

export function checkRole(allowedRoles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      const userIdHeader = req.headers["x-user-id"];

      let userIdStr = "";

      if (userIdHeader) {
        userIdStr = String(userIdHeader);
      } else if (authHeader) {
        if (authHeader.startsWith("Bearer ")) {
          userIdStr = authHeader.substring(7);
        } else {
          userIdStr = authHeader;
        }
      }

      if (!userIdStr) {
        res.status(401).json({ message: "Unauthorized: No user ID provided" });
        return;
      }

      const userId = Number(userIdStr);
      if (isNaN(userId)) {
        res.status(401).json({ message: "Unauthorized: Invalid user ID format" });
        return;
      }

      const userRepository = new UserRepository();
      const user = await userRepository.findById(userId);

      if (!user) {
        res.status(401).json({ message: "Unauthorized: User not found" });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(401).json({ message: "Unauthorized: Access denied for this role" });
        return;
      }

      // Attach user to request for use in controllers if needed
      (req as any).user = user;

      next();
    } catch (error) {
      next(error);
    }
  };
}
