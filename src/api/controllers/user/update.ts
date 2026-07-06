import {Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../repositories/user.repository';
import { UserService } from '../../services/user.service';

export async function update(req: Request, res: Response, next: NextFunction) {

    try {
        const id = Number(req.params.id);
        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);
        const updatedUser = await userService.update(id, req.body);

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
}