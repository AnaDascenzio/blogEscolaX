import { Repository } from 'typeorm'
import { appDataSource } from '../../lib/typeorm/typeorm'
import { Post } from '../entities/post.entity'
import { IPost } from '../entities/models/post.interface'
import { IPostRepository } from './interfaces/post.repository.interface'

export class PostRepository implements IPostRepository {
  private repository: Repository<Post>

  constructor() {
    this.repository = appDataSource.getRepository(Post)
  }

  async findAllActive(page: number = 1, limit: number = 10): Promise<{ post: IPost[], total: number }> {
    const [post, total] = await this.repository.findAndCount({
      where: { isDeleted: false },
      relations: { author: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return { post, total }
  }

  async findActiveById(id: number): Promise<IPost | null> {
    return this.repository.findOne({
      where: { id , isDeleted: false },
      relations: { author: true },
    })
  }

  async searchByKeyword(keyword: string): Promise<IPost[]> {
    return this.repository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.isDeleted = false')
      .andWhere(
        '(LOWER(post.title) LIKE LOWER(:keyword) OR LOWER(post.content) LIKE LOWER(:keyword))',
        { keyword: `%${keyword}%` }
      )
      .orderBy('post.createdAt', 'DESC')
      .getMany()
  }

  async create(post: IPost): Promise<IPost> {
    return this.repository.save(post)
  }

  async update(id: number, data: Partial<IPost>): Promise<IPost | null> {
  const post = await this.repository.findOne({ where: { id, isDeleted: false } })
  if (!post) {
    return null
  }

  const { title, content, summary, imageUrl, link, subject } = data
  Object.assign(post, { title, content, summary, imageUrl, link, subject })
  
  return this.repository.save(post)
}

  async softDelete(id: number): Promise<void> {
    await this.repository.update({ id }, { isDeleted: true })
  }
}