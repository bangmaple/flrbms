import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {BaseEntity} from './base/base.entity';

@Entity('slot')
export class Slot extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string;

  @Column({
    name: 'time_start',
    type: 'time',
  })
  timeStart?: string;

  @Column({
    name: 'time_end',
    type: 'time',
  })
  timeEnd?: string;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name?: string;

  @Column({
    name: 'description',
    type: 'varchar',
  })
  description?: string;

  @Column({
    name: 'slot_num',
    type: 'smallint',
    unique: true,
  })
  slotNum?: number;
}
