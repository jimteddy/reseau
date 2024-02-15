import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
}
