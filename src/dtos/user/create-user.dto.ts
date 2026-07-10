import { z } from "zod";
import { UserRole } from "../../api/entities/enums/user-roles.enum";

export const createUserSchema = z.object({
    name: z.string().min(3),
    email: z.email("Formato de e-mail inválido"),
    password: z.string().min(6),
    role: z.enum(UserRole)
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;