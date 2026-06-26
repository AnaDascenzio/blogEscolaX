import type { IPost } from "./post.interface";
import { UserRole } from "../enums/user-roles.enum";

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  posts?: IPost[];
}