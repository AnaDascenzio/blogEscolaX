import { IUser } from "../entities/models/user.interface";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { CreateUserDTO } from "../../dtos/user/create-user.dto";

export class UserService {

    constructor(
         private readonly repository: IUserRepository
    ) {}

    public async create(dto: CreateUserDTO): Promise<IUser> {
        const emailAlreadyExists = await this.repository.emailExists(dto.email);

        if (emailAlreadyExists) {
            throw new Error("E-mail já cadastrado.");
        }

        const user: IUser = {
        ...dto,
        role: dto.role,
        status: true,
        createdAt: new Date()
        };

    return this.repository.create(user);
    }

    public async findById (id: number): Promise<IUser | null> {
        return this.repository.findById(id)
    }

    public async findAll(page: number, limit: number, role?: IUser["role"]): Promise<{
        items: IUser[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }> {
        const [items, total] = await this.repository.findAll(page, limit, role);
        return {
            items,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    public async findByEmail (email: string): Promise<IUser | null> {
        return this.repository.findByEmail(email)
    }

    public async findByName (name: string): Promise<IUser | null> {
        return this.repository.findByName(name)
    }

    public async signin (email: string): Promise<IUser | null> {
        return this.repository.findByEmail(email);
    }

    async update(id: number, data: Partial<IUser>): Promise<IUser | null> {
        return this.repository.update(id, data);
    }

    async deactivate(id: number): Promise<boolean> {
        return this.repository.deactivate(id);
    }
}