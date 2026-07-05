import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../repositories/user.repository";
import { UserService } from "../../services/user.service";

export async function findByEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const email = String(req.params.email);

        // TODO atribuir isso pra uma factory
        const userRepository = new UserRepository()
        const userService = new UserService(userRepository)
        const user = await userService.findByEmail(email);

        return res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}
