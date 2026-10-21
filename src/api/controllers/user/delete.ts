import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { UserRepository } from "../../repositories/user.repository";
import { UserService } from "../../services/user.service";

const userIdSchema = z.coerce.number().int().positive();

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = userIdSchema.parse(req.params.id);
    const userService = new UserService(new UserRepository());
    const deactivated = await userService.deactivate(id);

    if (!deactivated) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
