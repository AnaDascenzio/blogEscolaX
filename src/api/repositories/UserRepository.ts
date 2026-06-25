import { appDataSource } from '../../lib/typeorm/typeorm';
import { User } from '../models/entities/User';
 
export const UserRepository = appDataSource.getRepository(User).extend({

    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ where: { email } });
    },

    async findByName(name: string): Promise<User | null> {
        return this.findOne({ where: { name } });
    },

    async findById(id: number): Promise<User | null> {
        return this.findOne({ where: { id: id as unknown as bigint, status: true } });
    },
})