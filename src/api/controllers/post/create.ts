import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../repositories/user.repository";
import { createPostSchema } from "../../../dtos/create-post.dto";
import { PostRepository } from "../../repositories/post.repository";
import { PostService } from "../../services/post.service";

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const post = createPostSchema.parse(req.body);

        //TODO atribuir isso pra uma factory
        const userRepository = new UserRepository()
        const postRepository = new PostRepository()
        const postService = new PostService(postRepository, userRepository)
        const createdPost = await postService.create(post);

        return res.status(201).json(createdPost);
    } catch (error) {
        next(error);
    }
}