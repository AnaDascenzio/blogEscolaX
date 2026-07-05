import { Request, Response, NextFunction } from "express";
import { UserRole } from "../entities/enums/user-roles.enum";

export function authorizeRoles(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Não autenticado." });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Acesso negado." });
        }

        return next();
    };
}
