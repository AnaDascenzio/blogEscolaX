import { Subject } from "../../api/entities/enums/subject.enum";

export interface PostResponseDTO {
  id: number;
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  link?: string;
  subject: Subject;
  authorId: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
