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
        return this.repository.findOne({ where: { email, status: true } });
    }

    async emailExists(email: string): Promise<boolean> {
        return this.repository.exists({ where: { email } });
    }

    async findByName(name: string): Promise<IUser | null> {
        return this.repository.findOne({ where: { name, status: true } });
    }

    async findById(id: number): Promise<IUser | null> {
    return this.repository.findOne({
        where: { id, status: true },
        relations: { posts: true },
    });
    }

    async create(user: IUser): Promise<IUser> {
        return this.repository.save(user)
    }

    async findAll(page: number, limit: number, role?: IUser['role']): Promise<[IUser[], number]> {
        return this.repository.findAndCount({
            where: role ? { status: true, role } : { status: true },
            order: { id: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async update(id: number, data: Partial<IUser>): Promise<IUser | null> {
        const user = await this.repository.findOne({ where: { id, status: true } })
        if (!user) {
            return null
        }

        Object.assign(user, data)
        return this.repository.save(user)
    }

    async deactivate(id: number): Promise<boolean> {
        const result = await this.repository.update(
            { id, status: true },
            { status: false },
        );
        return result.affected === 1;
    }
}