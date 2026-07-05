import { IUser } from "../entities/models/user.interface";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { CreateUserDTO } from "../../dtos/user/create-user.dto";
import { UserRole } from "../entities/enums/user-roles.enum";

export class UserService {

    constructor(
         private readonly repository: IUserRepository
    ) {}

    async create(dto: CreateUserDTO): Promise<IUser> {
        const emailAlreadyExists = await this.repository.findByEmail(dto.email);

        if (emailAlreadyExists) {
            throw new Error("E-mail jรก cadastrado.");
        }

        const user: IUser = {
        ...dto,
        role: dto.role || UserRole.STUDENT,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    return this.repository.create(user);
    }

    async findById (id: number): Promise<IUser | null> {
        return this.repository.findById(id)
    }

    async findByEmail (email: string): Promise<IUser | null> {
        return this.repository.findByEmail(email)
    }

    async findByName (name: string): Promise<IUser | null> {
        return this.repository.findByName(name)
    }
}