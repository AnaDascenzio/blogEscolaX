import type { IUser } from "../../entities/models/user.interface"

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>
  emailExists(email: string): Promise<boolean>
  findByName(name: string): Promise<IUser | null>
  findById(id: number): Promise<IUser | null>
  findAll(page: number, limit: number, role?: IUser["role"]): Promise<[IUser[], number]>
  create(user: IUser): Promise<IUser>
  update(id: number, data: Partial<IUser>): Promise<IUser | null>
  deactivate(id: number): Promise<boolean>
}
