import { Request, Response, NextFunction } from "express";
import { hash } from 'bcryptjs'
import { createUserSchema } from "../../../dtos/user/create-user.dto";
import { UserRepository } from "../../repositories/user.repository";
import { UserService } from "../../services/user.service";

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const user = createUserSchema.parse(req.body);

        const hashedPassword = await hash(user.password, 10);
        user.password = hashedPassword;

        // TODO atribuir isso pra uma factory
        const userRepository = new UserRepository()
        const userService = new UserService(userRepository)
        const createdUser = await userService.create(user);

        return res.status(201).json(createdUser);
    } catch (error) {
        next(error);
    }
}