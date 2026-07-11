import { z } from "zod";
import { Subject } from "../../api/entities/enums/subject.enum";

export const createPostSchema = z.object({
    title: z.string(),
    content: z.string(),
    summary: z.string().optional(),
    imageUrl: z.string().optional(),
    link: z.string().optional(),
    subject: z.enum(Subject)

});
export type CreatePostDTO = z.infer<typeof createPostSchema>;