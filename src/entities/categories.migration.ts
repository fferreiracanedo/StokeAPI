import { Entity, Column, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid'

@Entity()
export class Categories {

  @PrimaryColumn('uuid')
  readonly id: string

  @Column()
  name: string

  constructor() {
    if (!this.id) {
      this.id = uuid()
    }
  }

}