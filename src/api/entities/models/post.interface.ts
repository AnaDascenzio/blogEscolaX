import type { IUser } from "./user.interface";
import { Subject } from "../enums/subject.enum";

export interface IPost {
  id?: number;
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  link?: string;
  subject: Subject;
  authorId: number;
  isDeleted: boolean;
  author?: IUser;
  createdAt?: Date;
  updatedAt?: Date;
}