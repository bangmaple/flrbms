import {Column, CreateDateColumn, Entity, UpdateDateColumn} from 'typeorm';

@Entity()
export abstract class BaseEntity {
  @Column({
    name: 'created_by',
    nullable: false,
    default: false,
    type: 'uuid',
  })
  createdBy?: string;

  @Column({
    name: 'updated_by',
    nullable: false,
    default: false,
    type: 'uuid',
  })
  updatedBy?: string;

  @Column({
    name: 'deleted_by',
    nullable: false,
    default: false,
    type: 'uuid',
  })
  deletedBy?: string;

  @Column({
    type: 'timestamptz',
    name: 'deleted_at',
  })
  deletedAt?: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;
}

export abstract class BaseEntityWithDisabled extends BaseEntity {
  @Column({
    type: 'timestamptz',
    name: 'disabled_at',
  })
  disabledAt?: Date;

  @Column({
    name: 'disabled_by',
    nullable: false,
    default: false,
    type: 'uuid',
  })
  disabledBy?: string;
}
