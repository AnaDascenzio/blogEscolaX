import { z } from "zod";
import { UserRole } from "../../api/entities/enums/user-roles.enum";

const userRoleValues = Object.values(UserRole) as [string, ...string[]];

export const createUserSchema = z.object({
    name: z.string(3),
    email: z.email("Formato de e-mail inválido"),
    password: z.string(6),
    role: z.enum(userRoleValues)

});
export type CreateUserDTO = z.infer<typeof createUserSchema>;