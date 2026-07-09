import { CreatePostDTO } from "../../dtos/post/create-post.dto";
import { ObjectUtils } from "../../lib/object.util";
import { IPost } from "../entities/models/post.interface";
import { IPostRepository } from "../repositories/interfaces/post.repository.interface";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";

export class PostService {
    constructor(
             private readonly repository: IPostRepository,
             private readonly userRepository: IUserRepository
        ) {}

   public async create(dto: CreatePostDTO): Promise<IPost> {
    const author = await this.userRepository.findById(dto.authorId);
    if (!author) {
      throw new Error("Author not found");
    }

    const post: IPost = {
      title: dto.title,
      content: dto.content,
      subject: dto.subject,
      authorId: dto.authorId,
      isDeleted: false,
      createdAt: new Date(),
      ...ObjectUtils.removeUndefinedValues({
        summary: dto.summary,
        imageUrl: dto.imageUrl,
        link: dto.link,
      }),
    };

    return this.repository.create(post);
   }

   public async findById(id: number): Promise<IPost | null> {
    return this.repository.findActiveById(id)
   }

   public async findAll(page: number = 1, limit: number = 10): Promise<{ post: IPost[]; total: number }> {
    return this.repository.findAllActive(page, limit);

   }

   public async search(keyword: string): Promise<IPost[]> {
    return this.repository.searchByKeyword(keyword);

   }

   public async update(id: number, dto: CreatePostDTO): Promise<IPost | null> {

     const post: IPost = {
      title: dto.title,
      content: dto.content,
      subject: dto.subject,
      authorId: dto.authorId,
      isDeleted: false,
      updatedAt: new Date(),
      ...ObjectUtils.removeUndefinedValues({
        summary: dto.summary,
        imageUrl: dto.imageUrl,
        link: dto.link,
      }),
    };

    return this.repository.update(id, post);
   }

   public async remove(id: number): Promise<void> {
    const post = await this.repository.findActiveById(id);
    if (!post) {
        throw new Error ("Post not found");
    }
    await this.repository.softDelete(id);
   }
}