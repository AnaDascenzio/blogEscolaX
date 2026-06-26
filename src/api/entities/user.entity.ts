import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany
} from "typeorm";
import { UserRole } from "./enums/user-roles.enum";
import { Post } from "./post.entity";
import { IUser } from "./models/user.interface";

@Entity("users")
@Index("idx_user_email", ["email"], { unique: true })
export class User implements IUser{
    
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({ type: "varchar", length: 200 })
  name: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "enum", enum: UserRole })
  role: UserRole;

  @Column({ type: "boolean", default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
