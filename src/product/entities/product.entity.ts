import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({})
export class Product {

  @PrimaryGeneratedColumn({})
  readonly id: number;

  @Column({})
  readonly libelle : string;

  @Column({})
  readonly price : number

  @CreateDateColumn()
  readonly createAt : Date

  @UpdateDateColumn()
  readonly updateAt : Date
  
}
