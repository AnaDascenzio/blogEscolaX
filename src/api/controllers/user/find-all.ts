import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { UserRole } from "../../entities/enums/user-roles.enum";
import { mapUserToListItemDTO } from "../../mappers/user.mapper";
import { UserRepository } from "../../repositories/user.repository";
import { UserService } from "../../services/user.service";

const listUsersQuerySchema = z.object({
  role: z.enum(UserRole).optional(),
  page: z.string().regex(/^\d+$/).optional().default("1").transform(Number)
    .pipe(z.number().int().min(1)),
  limit: z.string().regex(/^\d+$/).optional().default("20").transform(Number)
    .pipe(z.number().int().min(1).max(100)),
});

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, role } = listUsersQuerySchema.parse(req.query);
    const userService = new UserService(new UserRepository());
    const result = await userService.findAll(page, limit, role);

    return res.status(200).json({
      ...result,
      items: result.items.map(mapUserToListItemDTO),
    });
  } catch (error) {
    return next(error);
  }
}
