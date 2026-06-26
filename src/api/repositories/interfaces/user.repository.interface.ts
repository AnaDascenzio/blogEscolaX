import type { IUser } from "../../entities/models/user.interface"

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>
  findByName(name: string): Promise<IUser | null>
  findById(id: number): Promise<IUser | null>
  create(user: IUser): Promise<IUser>
  update(id: number, data: Partial<IUser>): Promise<IUser | null>
}
