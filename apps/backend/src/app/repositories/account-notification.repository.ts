import {AccountNotification} from './../models/account-notification.entity';
import {QueryRunner, Repository} from 'typeorm';
import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {Notification} from '../models';

@CustomRepository(AccountNotification)
export class AccountNotificationRepository extends Repository<Notification> {
  async sendNotification(
    notificationId,
    receiver: string,
    queryRunner: QueryRunner
  ): Promise<AccountNotification> {
    return queryRunner.manager.save(AccountNotification, {
      accountId: receiver,
      notificationId: notificationId,
      createAt: new Date(),
    });
  }

  getYourOwnNotifications(userId): Promise<Notification[]> {
    return this.createQueryBuilder('a_noti')
      .select('noti.id', 'id')
      .addSelect('noti.title', 'title')
      .addSelect('noti.message', 'message')
      .addSelect('noti.created_at', 'createdAt')
      .addSelect('a_noti.account_id', 'receiver')
      .where('a_noti.account_id = :id', {id: userId})
      .innerJoin(Notification, 'noti', 'noti.id = a_noti.notification_id')
      .orderBy('noti.created_at', 'DESC')
      .getRawMany<Notification>();
  }
}
