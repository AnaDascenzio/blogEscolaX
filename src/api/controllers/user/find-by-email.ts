import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../repositories/user.repository";
import { UserService } from "../../services/user.service";
import { mapUserToResponseDTO } from "../../mappers/user.mapper";
import { z } from "zod";

export async function findByEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const email = z.email().parse(req.params.email);

        // TODO atribuir isso pra uma factory
        const userRepository = new UserRepository()
        const userService = new UserService(userRepository)
        const user = await userService.findByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        return res.status(200).json(mapUserToResponseDTO(user));
    } catch (error) {
        next(error);
    }
}
