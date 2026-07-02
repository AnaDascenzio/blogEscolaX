import { Repository } from 'typeorm';
import { appDataSource } from '../../lib/typeorm/typeorm';
import { User } from '../entities/user.entity';
import { IUser } from '../entities/models/user.interface';

// TODO usar interface
export class UserRepository {

  private repository: Repository<User>

  constructor() {
    this.repository = appDataSource.getRepository(User)
  }

    async findByEmail(email: string): Promise<IUser | null> {
        return this.repository.findOne({ where: { email } });
    }

    async findByName(name: string): Promise<IUser | null> {
        return this.repository.findOne({ where: { name } });
    }

    async findById(id: number): Promise<IUser | null> {
        return this.repository.findOne({ where: { id , status: true } });
    }

    async create(user: IUser): Promise<IUser> {
        return this.repository.save(user)
    }

    async update(id: number, data: Partial<IUser>): Promise<IUser | null> {
        const user = await this.repository.findOne({ where: { id } })
        if (!user) {
            return null
        }

        Object.assign(user, data)
        return this.repository.save(user)
    }
}