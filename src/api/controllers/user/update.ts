import {Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../repositories/user.repository';
import { UserService } from '../../services/user.service';
import { z } from 'zod';
import { UserRole } from '../../entities/enums/user-roles.enum';
import { hash } from 'bcryptjs';
import { mapUserToResponseDTO } from '../../mappers/user.mapper';
import { IUser } from '../../entities/models/user.interface';

const userIdSchema = z.coerce.number().int().positive();
const updateUserSchema = z.object({
    name: z.string().min(3).optional(),
    email: z.email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(UserRole).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualização.",
});

export async function update(req: Request, res: Response, next: NextFunction) {

    try {
        const id = userIdSchema.parse(req.params.id);
        const data = updateUserSchema.parse(req.body);
        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);
        const updateData: Partial<IUser> = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.role !== undefined) updateData.role = data.role;
        if (data.password !== undefined) updateData.password = await hash(data.password, 10);

        const updatedUser = await userService.update(id, updateData);

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        return res.status(200).json(mapUserToResponseDTO(updatedUser));
    } catch (error) {
        next(error);
    }
}