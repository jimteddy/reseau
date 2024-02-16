import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({})
export class Category {

  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({})
  readonly libelle: string;

  @CreateDateColumn()
  readonly createAt : Date

  @UpdateDateColumn()
  readonly updateAt : Date

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
