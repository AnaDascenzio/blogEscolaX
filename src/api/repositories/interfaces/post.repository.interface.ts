import type { IPost } from "../../entities/models/post.interface"

export interface IPostRepository {
  findAllActive(page?: number, limit?: number): Promise<{ post: IPost[]; total: number }>
  findActiveById(id: number): Promise<IPost | null>
  searchByKeyword(keyword: string): Promise<IPost[]>
  create(post: IPost): Promise<IPost>
  update(id: number, data: Partial<IPost>): Promise<IPost | null>
  softDelete(id: number): Promise<void>
}
