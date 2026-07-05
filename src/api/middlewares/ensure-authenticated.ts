import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/user.repository";

// TODO: substituir a leitura do header por validação de JWT quando o login existir.
export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = Number(req.header("x-user-id"));

        if (!userId || Number.isNaN(userId)) {
            return res.status(401).json({ message: "Não autenticado." });
        }

        const userRepository = new UserRepository();
        const user = await userRepository.findById(userId);

        if (!user || !user.status) {
            return res.status(401).json({ message: "Não autenticado." });
        }

        req.user = { id: userId, role: user.role };

        return next();
    } catch (error) {
        next(error);
    }
}
