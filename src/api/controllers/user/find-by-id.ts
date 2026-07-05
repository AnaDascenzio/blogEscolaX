import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../repositories/user.repository";
import { UserService } from "../../services/user.service";
import { mapUserToResponseDTO } from "../../mappers/user.mapper";

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);

        // TODO atribuir isso pra uma factory
        const userRepository = new UserRepository()
        const userService = new UserService(userRepository)
        const user = await userService.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(mapUserToResponseDTO(user));
    } catch (error) {
        next(error);
    }
}