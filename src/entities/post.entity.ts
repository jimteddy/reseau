import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne, Exclusion } from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";

@Entity({ name: "posts"})
export class Post{
  @PrimaryGeneratedColumn({ type: "bigint"})
  id : number;

  @Column({})
  title : string;
  
  @Column({ })
  body : string;
  
  @Column({ default: new Date()})
  createAt : Date

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

}