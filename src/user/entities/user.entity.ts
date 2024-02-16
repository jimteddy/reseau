import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, Exclusion, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({})
  readonly password: string;

  @Column({ unique: true })
  readonly telephone: string;

  @Column()
  readonly nom: string;
  
  @Column()
  readonly prenom: string;

  @Column({ nullable : true, enum: ["Feminin", "Masculin"]})
  readonly genre: string;

  @Column({ nullable : true})
  readonly adresse: string;

  @CreateDateColumn()
  readonly createAt : Date;

  @UpdateDateColumn()
  readonly updateAt : Date;

  @OneToMany(() => Product, (product) => product.user)
  products : Product[]

}
