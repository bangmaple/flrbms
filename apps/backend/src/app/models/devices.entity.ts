import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {BaseEntityWithDisabled} from './base/base.entity';

@Entity('devices')
export class Devices extends BaseEntityWithDisabled {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'ID for Equipments',
  })
  id?: string;

  @Column({
    name: 'name',
    nullable: false,
    unique: true,
    length: 250,
    type: 'varchar',
    comment: `Equipment's name`,
  })
  name?: string;

  @Column({
    name: 'description',
    nullable: false,
    unique: false,
    length: 500,
    type: 'varchar',
    comment: 'Equipments description',
  })
  description?: string;

  @Column({
    name: 'type',
    nullable: false,
    unique: false,
    length: 250,
    type: 'varchar',
    comment: 'Equipments description',
  })
  type?: string;
}
