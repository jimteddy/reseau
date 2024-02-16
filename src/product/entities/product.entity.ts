import { Category } from "src/category/entities/category.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({})
export class Product {

  @PrimaryGeneratedColumn({})
  readonly id: number;

  @Column({})
  readonly libelle : string;

  @Column({})
  readonly price : number

  @Column({default: true})
  readonly isVisible : boolean

  @CreateDateColumn()
  readonly createAt : Date

  @UpdateDateColumn()
  readonly updateAt : Date

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false, onDelete: "CASCADE", onUpdate: "CASCADE",
  })
  category: Category

  @ManyToOne(() => User, (user) => user.products, { 
    nullable: false, createForeignKeyConstraints: true, 
    onDelete: "CASCADE", onUpdate: "CASCADE",
    persistence: true
  })
  user: User;
  
}
