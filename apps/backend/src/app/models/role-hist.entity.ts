import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {BaseEntity} from './base/base.entity';

@Entity('role_hist')
export class RoleHist extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string;

  @Column({
    name: 'role_id',
    type: 'uuid',
  })
  roleId?: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
  })
  name?: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 500,
  })
  description?: string;
}
