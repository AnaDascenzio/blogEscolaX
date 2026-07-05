import { UserResponseDTO } from "../../dtos/user/user-response.dto";
import { IUser } from "../entities/models/user.interface";

export function mapUserToResponseDTO(user: IUser): UserResponseDTO {
  const response: UserResponseDTO = {
    id: user.id!,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    posts: user.posts || [],
  };

  return response;
}
