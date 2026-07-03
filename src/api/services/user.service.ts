import { IUser } from "../entities/models/user.interface";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { CreateUserDTO } from "../../dtos/user/create-user.dto";
import { UserRole } from "../entities/enums/user-roles.enum";

export class UserService {

    constructor(
         private readonly repository: IUserRepository
    ) {}

    async create(dto: CreateUserDTO): Promise<number | undefined> {
        const emailAlreadyExists = await this.repository.findByEmail(dto.email);

        if (emailAlreadyExists) {
            throw new Error("E-mail já cadastrado.");
        }

        const user: IUser = {
        ...dto,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    return this.repository.create(user).then((createdUser) => createdUser.id);
    }

    async findById (id: number): Promise<IUser | null> {
        return this.repository.findById(id)
    }
}