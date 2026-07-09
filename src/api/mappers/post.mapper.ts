import { IPost } from "../entities/models/post.interface";
import { PostResponseDTO } from "../../dtos/post/post-response.dto";
import { ObjectUtils } from "../../lib/object.util";

export function mapPostToResponseDTO(post: IPost): PostResponseDTO {
  const {
    id,
    title,
    content,
    summary,
    imageUrl,
    link,
    subject,
    authorId,
    isDeleted,
    createdAt,
    updatedAt,
  } = post;

  return {
    id: id!,
    title,
    content,
    subject,
    authorId,
    isDeleted,
    ...ObjectUtils.removeUndefinedValues({ summary, imageUrl, link, createdAt, updatedAt }),
  };
}
