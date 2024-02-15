import { CreateDateColumn, UpdateDateColumn } from "typeorm"

export class Auth {


  @CreateDateColumn()
  readonly createAt : Date

  @UpdateDateColumn()
  readonly updateAt : Date
  
}
