import { UserRole } from "../../api/entities/enums/user-roles.enum";
import { IPost } from "../../api/entities/models/post.interface";

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: boolean;
  posts: IPost[];
}
