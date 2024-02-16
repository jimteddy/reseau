import {Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm"
 
export class Catalogue {

  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({})
  readonly titre : string

  @Column({default: true})
  readonly isVisible : boolean

  @CreateDateColumn()
  readonly createAt : Date

  @UpdateDateColumn()
  readonly updateAt : Date

  
}
