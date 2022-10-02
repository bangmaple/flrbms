import {BadRequestException, Injectable, Logger,} from '@nestjs/common';
import {QueryRunner} from 'typeorm';
import {AccountNotificationRepository} from '../repositories/account-notification.repository';

@Injectable()
export class AccountNotificationService {
  private readonly logger = new Logger(AccountNotificationService.name);

  constructor(
    private readonly repository: AccountNotificationRepository,
  ) {
  }

  async sendNotification(
    notificationId: string,
    receiver: string,
    queryRunner: QueryRunner
  ) {
    try {
      this.repository.sendNotification(notificationId, receiver, queryRunner);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ?? 'Error occurred while send notification'
      );
    }
  }

  getYourOwnNotifications(userId: string) {
    try {
      return this.repository.getYourOwnNotifications(userId);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ?? 'Error occurred while get notifications'
      );
    }
  }

}
