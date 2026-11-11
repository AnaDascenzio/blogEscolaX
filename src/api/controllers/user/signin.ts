import { Request, Response } from "express";
import z from "zod";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../repositories/user.repository";
import { UserService } from "../../services/user.service";
import { compare } from "bcryptjs";

export async function signin(req: Request, res: Response) {
    const registerBodySchema = z.object({
        email: z.string().email(),
        password: z.string()
    });

    const { email, password } = registerBodySchema.parse(req.body);
    const normalizedEmail = email.trim();
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);

    const user = await userService.signin(normalizedEmail);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const doesPasswordMatch = await compare(password, user.password);
    if (!doesPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign(
    {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    },
    process.env.JWT_SECRET!,
    {
        expiresIn: "1d"
    }
    );

    res.json({ token });
}
