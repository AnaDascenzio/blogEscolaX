import { CreatePostDTO } from "../../dtos/post/create-post.dto";
import { IPost } from "../entities/models/post.interface";
import { IPostRepository } from "../repositories/interfaces/post.repository.interface";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";

export class PostService {
    constructor(
             private readonly repository: IPostRepository,
             private readonly userRepository: IUserRepository
        ) {}

   async create(dto: CreatePostDTO): Promise<IPost> {
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
      updatedAt: new Date(),
    };

    if (dto.summary !== undefined) {
      post.summary = dto.summary;
    }

    if (dto.imageUrl !== undefined) {
      post.imageUrl = dto.imageUrl;
    }

    if (dto.link !== undefined) {
      post.link = dto.link;
    }

    return this.repository.create(post);
   }

   async findById(id: number): Promise<IPost | null> {
    return this.repository.findActiveById(id)
   }
}