import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../repositories/user.repository";
import { UserService } from "../../services/user.service";
import { mapUserToResponseDTO } from "../../mappers/user.mapper";
import { z } from "zod";

export async function findByName(req: Request, res: Response, next: NextFunction) {
    try {
        const name = z.string().trim().min(1).parse(req.params.name);

        // TODO atribuir isso pra uma factory
        const userRepository = new UserRepository()
        const userService = new UserService(userRepository)
        const user = await userService.findByName(name);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        return res.status(200).json(mapUserToResponseDTO(user));
    } catch (error) {
        next(error);
    }
}
