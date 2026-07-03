import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../repositories/user.repository";
import { PostRepository } from "../../repositories/post.repository";
import { PostService } from "../../services/post.service";
import { mapPostToResponseDTO } from "../../mappers/post.mapper";

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);

        // TODO atribuir isso pra uma factory
        const userRepository = new UserRepository()
        const postRepository = new PostRepository()
        const postService = new PostService(postRepository, userRepository);
        const post = await postService.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json(mapPostToResponseDTO(post));
    } catch (error) {
        next(error);
    }
}