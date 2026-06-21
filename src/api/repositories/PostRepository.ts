import { appDataSource } from '../../lib/typeorm/typeorm';
import { Post } from '../models/entities/Post';
 
export const PostRepository = appDataSource.getRepository(Post).extend({

    async findAllActive(): Promise<Post[]> {
        return this.find({
             where: { isDeleted: false },
             relations: { author: true },
            order:{ createdAt: "DESC" } 
        });
    },

    async findActiveById(id: number): Promise<Post | null> {
        return this.findOne({
            where: { id: id as unknown as bigint, isDeleted: false },
            relations: { author: true }
        });
    },
    
    async searchByKeyword(keyword: string): Promise<Post[]> {
        return this.createQueryBuilder("post")
            .leftJoinAndSelect("post.author", "author")
            .where("post.isDeleted = false")
            .andWhere(
                '(LOWER(post.title) LIKE LOWER(:keyword) OR LOWER(post.content) LIKE LOWER(:keyword))',
                { keyword: `%${keyword}%` }
            )
            .orderBy("post.createdAt", "DESC")
            .getMany();
        },

    async softDelete(id: number): Promise<void> {
        await this.update({ id: id as unknown as bigint }, { isDeleted: true });
        },
    })