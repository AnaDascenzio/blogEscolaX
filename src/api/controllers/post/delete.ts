import { Request, Response, NextFunction } from 'express';
import { PostRepository } from '../../repositories/post.repository';
import { PostService } from '../../services/post.service';
import { UserRepository } from '../../repositories/user.repository';

export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);

        const postRepository = new PostRepository();
        const userRepository = new UserRepository();
        const postService = new PostService(postRepository, userRepository);
        await postService.remove(id);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}