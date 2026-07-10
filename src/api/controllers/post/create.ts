import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../repositories/user.repository";
import { createPostSchema } from "../../../dtos/post/create-post.dto";
import { PostRepository } from "../../repositories/post.repository";
import { PostService } from "../../services/post.service";
import { mapPostToResponseDTO } from "../../mappers/post.mapper";

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const post = createPostSchema.parse(req.body);
        const authorId = req.user?.id;

        if (!authorId) {
            return res.status(401).json({ message: "Não autenticado." });
        }

        // TODO atribuir isso pra uma factory
        const userRepository = new UserRepository();
        const postRepository = new PostRepository();
        const postService = new PostService(postRepository, userRepository);
        const createdPost = await postService.create({ ...post, authorId });

        return res.status(201).json(mapPostToResponseDTO(createdPost));
    } catch (error) {
        next(error);
    }
}