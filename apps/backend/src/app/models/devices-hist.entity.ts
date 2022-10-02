import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {BaseEntityWithDisabled} from './base/base.entity';

@Entity('device_hist')
export class DeviceHist extends BaseEntityWithDisabled {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string;

  @Column({
    name: 'device_id',
    type: 'uuid',
  })
  deviceId?: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
  })
  name?: string;

  @Column({
    name: 'type',
    type: 'uuid',
  })
  type?: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 500,
  })
  description?: string;
}
