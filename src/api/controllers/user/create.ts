import { Request, Response, NextFunction } from "express";
import { hash } from 'bcryptjs'
import { createUserSchema } from "../../../dtos/user/create-user.dto";
import { UserRepository } from "../../repositories/user.repository";
import { UserService } from "../../services/user.service";
import { mapUserToResponseDTO } from "../../mappers/user.mapper";

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const validatedData = createUserSchema.parse(req.body);

        const hashedPassword = await hash(validatedData.password, 10);
        
        const userData = {
            ...validatedData,
            password: hashedPassword,
            role: validatedData.role
        };

        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);
        
        const createdUser = await userService.create(userData as any);

        return res.status(201).json(mapUserToResponseDTO(createdUser));
    } catch (error) {
        next(error);
    }
}