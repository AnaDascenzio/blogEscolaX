import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";

interface JwtPayload {
    id: string | number;
}

function extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1]?.trim();
    return token || null;
}

function parseValidUserId(id: unknown): number | null {
    const parsed = Number(id);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {

    const userRepository = new UserRepository(); 
    const unauthorized = () => res.status(401).json({ message: "Não autenticado." });

    try {
        const token = extractTokenFromHeader(req.header("authorization"));
        if (!token) return unauthorized();

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        } catch {
            return unauthorized();
        }

        const userId = parseValidUserId(decoded?.id);
        if (!userId) return unauthorized();

        const user = await userRepository.findById(userId);
        if (!user || !user.status) return unauthorized();

        req.user = { id: userId, role: user.role };

        return next();
    } catch (error) {
        return next(error);
    }
}