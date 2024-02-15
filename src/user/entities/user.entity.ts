import { Column, CreateDateColumn, Entity, Exclusion, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

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

  @Column({ nullable : true})
  readonly genre: string;

  @Column({ nullable : true})
  readonly adresse: string;

  @CreateDateColumn()
  readonly createAt : Date;

  @UpdateDateColumn()
  readonly updateAt : Date;
}
