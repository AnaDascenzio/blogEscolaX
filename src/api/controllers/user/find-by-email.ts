import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../repositories/user.repository";
import { UserService } from "../../services/user.service";
import { mapUserToResponseDTO } from "../../mappers/user.mapper";

export async function findByEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const email = String(req.params.email);

        // TODO atribuir isso pra uma factory
        const userRepository = new UserRepository()
        const userService = new UserService(userRepository)
        const user = await userService.findByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(201).json(mapUserToResponseDTO(user));
    } catch (error) {
        next(error);
    }
}
