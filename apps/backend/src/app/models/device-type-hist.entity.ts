import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {BaseEntity} from './base/base.entity';

@Entity('device_type_hist')
export class DeviceTypeHist extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string;

  @Column({
    name: 'device_type_id',
    type: 'uuid',
  })
  deviceTypeId?: string;

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
