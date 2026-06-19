import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from "typeorm";
import { Subject } from "../enums/Subject";
import { User } from "./User";

@Entity("posts")
@Index("idx_post_author", ["authorId"])
@Index("idx_post_subject", ["subject"])
@Index("idx_post_created_at", ["createdAt"])
export class Post {

  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: bigint;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "text", nullable: true })
  summary: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  link: string;

  @Column({ type: "enum", enum: Subject })
  subject: Subject;

  @Column({ type: "bigint" })
  authorId: bigint;

  @Column({ type: "boolean", default: false})
  isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "authorId" })
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
