import { Request, Response, NextFunction } from 'express';
import { PostRepository } from '../../repositories/post.repository';
import { PostService } from '../../services/post.service';
import { UserRepository } from '../../repositories/user.repository';
import { createPostSchema } from '../../../dtos/post/create-post.dto';

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const post = createPostSchema.parse(req.body);
        const postRepository = new PostRepository();
        const userRepository = new UserRepository();
        const postService = new PostService(postRepository, userRepository);
        const updatedPost = await postService.update(id, post);

        if(!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json(updatedPost);
    } catch (error) {
        next (error);
    }
}