import { IPost } from "../entities/models/post.interface";
import { PostResponseDTO } from "../../dtos/post/post-response.dto";

export function mapPostToResponseDTO(post: IPost): PostResponseDTO {
  const response: PostResponseDTO = {
    id: post.id!,
    title: post.title,
    content: post.content,
    subject: post.subject,
    authorId: post.authorId,
    isDeleted: post.isDeleted,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };

  if (post.summary !== undefined) {
    response.summary = post.summary;
  }

  if (post.imageUrl !== undefined) {
    response.imageUrl = post.imageUrl;
  }

  if (post.link !== undefined) {
    response.link = post.link;
  }

  return response;
}
