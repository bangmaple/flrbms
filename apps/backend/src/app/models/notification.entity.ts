import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,} from 'typeorm';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 100,
  })
  title?: string;

  @Column({
    name: 'message',
    type: 'varchar',
    length: 500,
  })
  message?: string;

  @Column({
    name: 'created_by',
    type: 'uuid',
  })
  createdBy?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt?: Date;

  @Column({
    name: 'deleted_by',
    type: 'uuid',
  })
  deletedBy?: string;

  @Column({
    name: 'deleted_at',
    type: 'timestamptz',
  })
  deletedAt?: Date;

}
