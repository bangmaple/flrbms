import {Column, CreateDateColumn, Entity, Generated, PrimaryColumn,} from 'typeorm';

@Entity('account_notification')
export class AccountNotification {
  @PrimaryColumn('uuid', {
    name: 'id',
    comment: 'ID for Room',
  })
  @Generated('uuid')
  id?: string;

  @Column({
    type: 'uuid',
    name: 'notification_id',
  })
  notificationId?: string;

  @Column({
    type: 'uuid',
    name: 'account_id',
  })
  accountId?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;
}
