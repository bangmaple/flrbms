import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';

@Entity('feedback_type')
export class FeedbackType {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string;

  @Column({
    name: 'name',
    unique: true,
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

  @Column({
    name: 'created_by',
    type: 'uuid',
  })
  createdBy?: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: Date;

  @Column({
    name: 'updated_by',
    type: 'uuid',
  })
  updatedBy?: string;

  @Column({
    name: 'deleted_by',
    type: 'uuid',
  })
  deletedBy?: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt?: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamptz',
  })
  deletedAt?: Date;
}
