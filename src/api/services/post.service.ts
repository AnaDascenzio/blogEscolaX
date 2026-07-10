import { CreatePostDTO } from "../../dtos/post/create-post.dto";
import { ObjectUtils } from "../../lib/object.util";
import { IPost } from "../entities/models/post.interface";
import { IPostRepository } from "../repositories/interfaces/post.repository.interface";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";

type CreatePostInput = CreatePostDTO & { authorId?: number };

export class PostService {
  constructor(
    private readonly repository: IPostRepository,
    private readonly userRepository: IUserRepository
  ) {}

  private sanitizeAuthor(post: IPost): IPost {
    if (post.author) {
      const authorData = { ...(post.author as unknown as Record<string, unknown>) };
      Reflect.deleteProperty(authorData, "password");
      return { ...post, author: authorData as unknown as NonNullable<IPost["author"]> };
    }
    return post;
  }

  public async create(dto: CreatePostInput): Promise<IPost> {
    const authorId = dto.authorId;
    if (!authorId) {
      throw new Error("Author not found");
    }

    const author = await this.userRepository.findById(authorId);
    if (!author) {
      throw new Error("Author not found");
    }

    const post: IPost = {
      title: dto.title,
      content: dto.content,
      subject: dto.subject,
      authorId,
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
    const post = await this.repository.findActiveById(id);
    return post ? this.sanitizeAuthor(post) : null;
  }

  public async findAll(page: number = 1, limit: number = 10) {
    const result = await this.repository.findAllActive(page, limit);

    const sanitizedPosts = result.post.map((post) => this.sanitizeAuthor(post));

    return { post: sanitizedPosts, total: result.total };
  }

  public async search(keyword: string): Promise<IPost[]> {
    const posts = await this.repository.searchByKeyword(keyword);
    
    return posts.map((post) => this.sanitizeAuthor(post));
  }

  public async update(id: number, dto: CreatePostInput): Promise<IPost | null> {
    const existingPost = await this.repository.findActiveById(id);
    if (!existingPost) {
      return null;
    }

    const post: IPost = {
      title: dto.title,
      content: dto.content,
      subject: dto.subject,
      authorId: dto.authorId ?? existingPost.authorId,
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
      throw new Error("Post not found");
    }
    await this.repository.softDelete(id);
  }
}