import { CreateDateColumn, UpdateDateColumn } from "typeorm"

export class Catalogue {


  @CreateDateColumn()
  readonly createAt : Date

  @UpdateDateColumn()
  readonly updateAt : Date
}
