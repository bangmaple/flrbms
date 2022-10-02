import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {BaseEntity} from './base/base.entity';

@Entity('role')
export class Roles extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string;

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
}
