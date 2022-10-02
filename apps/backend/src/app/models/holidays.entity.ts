import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {BaseEntity} from "./base/base.entity";

@Entity('holidays')
export class Holidays extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'ID for holiday',
  })
  id?: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
    length: 100,
    unique: true
  })
  name?: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 500
  })
  description?: string;

  @Column({
    name: 'date_start',
    type: 'date',
    nullable: false,
  })
  dateStart?: string

  @Column({
    name: 'date_end',
    type: 'date',
    nullable: false,
  })
  dateEnd?: string


}
