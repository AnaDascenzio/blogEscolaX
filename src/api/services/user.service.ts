import { IUser } from "../entities/models/user.interface";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { CreateUserDTO } from "../../dtos/user/create-user.dto";

export class UserService {

    constructor(
         private readonly repository: IUserRepository
    ) {}

    public async create(dto: CreateUserDTO): Promise<IUser> {
        const emailAlreadyExists = await this.repository.findByEmail(dto.email);

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

    public async findByEmail (email: string): Promise<IUser | null> {
        return this.repository.findByEmail(email)
    }

    public async findByName (name: string): Promise<IUser | null> {
        return this.repository.findByName(name)
    }

    public async signin (email: string): Promise<IUser | null> {
        const user = await this.repository.findByEmail(email);
        
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
        return user;
    }

    async update(id: number, data: Partial<IUser>): Promise<IUser | null> {
    const user = await this.repository.findById(id);

    if (!user) {
        throw new Error("Usuário não encontrado.");
    }

    return this.repository.update(id, data);
    }
}