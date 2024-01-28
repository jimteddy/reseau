import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity({ name: 'comments'})
export class Comment{
  @PrimaryGeneratedColumn()
  id : number;

  @Column({})
  content : string;
  
  @CreateDateColumn()
  createAt : Date
  @UpdateDateColumn()
  updatedAt : Date
  
  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;
  
  @ManyToOne(() => User, (user) => user.comments)
  user: User;
}