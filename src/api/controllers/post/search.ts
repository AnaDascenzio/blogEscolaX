import { Request, Response, NextFunction } from 'express';
import { PostRepository } from '../../repositories/post.repository';
import { PostService } from '../../services/post.service';
import {UserRepository} from "../../repositories/user.repository";

export async function search(req: Request, res: Response, next: NextFunction) {
    try {
        const keyword = req.query.keyword as string;

        if (!keyword || keyword.trim() === "") {
            return res.status(400).json({ message: "Keyword is required" });
        }

        const postRepository = new PostRepository();
        const userRepository = new UserRepository();
        const postService = new PostService(postRepository, userRepository);
        const posts = await postService.search(keyword.trim());

        return res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
}