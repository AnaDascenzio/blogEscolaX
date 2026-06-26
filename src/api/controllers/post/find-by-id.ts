import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../repositories/user.repository";
import { PostRepository } from "../../repositories/post.repository";
import { PostService } from "../../services/post.service";

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);

        //TODO atribuir isso pra uma factory
        const userRepository = new UserRepository()
        const postRepository = new PostRepository()
        const postService = new PostService(postRepository, userRepository)
        const post = await postService.findById(id);

        return res.status(201).json(post);
    } catch (error) {
        next(error);
    }
}