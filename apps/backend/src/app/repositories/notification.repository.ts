import {QueryRunner, Repository} from 'typeorm';
import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {Notification} from '../models/notification.entity';

@CustomRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  existsById(id: string): Promise<boolean> {
    return this.createQueryBuilder('noti')
      .select('COUNT(1)', 'count')
      .where('noti.id = :id', {id: id})
      .getRawOne()
      .then((data) => data?.count > 0);
  }

  async findById(id: string): Promise<Notification> {
    return this.createQueryBuilder('noti')
      .select('noti.id', 'id')
      .addSelect('noti.title', 'title')
      .addSelect('noti.message', 'message')
      .addSelect('noti.created_at', 'createdAt')
      // .addSelect('noti.receiver', 'receiver')
      .where('noti.id = :id', {id: id})
      .getRawOne<Notification>();
  }

  async createNotification(
    payload: { title: string; message: string },
    queryRunner: QueryRunner
  ): Promise<Notification> {
    return queryRunner.manager.save(Notification, {
      title: payload.title,
      message: payload.message,
      createdAt: new Date(),
    });
  }


}
