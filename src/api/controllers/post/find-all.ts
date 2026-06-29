import { Request, Response, NextFunction } from 'express';
import { PostRepository } from '../../repositories/post.repository';
import { PostService } from '../../services/post.service';
import { UserRepository } from '../../repositories/user.repository';

export async function findAll(req: Request, res: Response, next: NextFunction) {

    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const postRepository = new PostRepository();
        const userRepository = new UserRepository();
        const postService = new PostService(postRepository, userRepository);
        const result = await postService.findAll(page, limit);
        
        return res.status(200).json(result);
} catch (error) {
        next(error);
    }
}