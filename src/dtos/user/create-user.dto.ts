import { z } from "zod";
import { UserRole } from "../../api/entities/enums/user-roles.enum";

export const createUserSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
    role: z.enum(UserRole)

});
export type CreateUserDTO = z.infer<typeof createUserSchema>;