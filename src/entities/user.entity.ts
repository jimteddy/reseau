import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { Comment } from "./comment.entity";

@Entity({ name: "users" })
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ })
  username: string;

  @Column({ unique: true})
  email: string;

  @Column({ })
  password: string;

  @Column({ default: new Date})
  createAt: Date;

  @Column({ default: new Date})
  updateAt: Date;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];
  
}