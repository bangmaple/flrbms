import {BadRequestException, forwardRef, Inject, Injectable, Logger,} from '@nestjs/common';
import {QueryRunner} from 'typeorm';
import {NotificationRepository} from '../repositories/notification.repository';
import {Notification} from '../models/notification.entity';
import * as admin from 'firebase-admin';
import {AccountsService} from './accounts.service';
import {AccountNotificationService} from './account-notification.service';
import dayjs = require('dayjs');

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly repository: NotificationRepository,

    @Inject(forwardRef(() => AccountsService))
    private readonly accountService: AccountsService,

    private readonly accountNotificationService: AccountNotificationService
  ) {
  }

  async sendBookedForNotification(
    checkinDate: string,
    checkinTime: string,
    checkoutTime: string,
    roomName: string,
    sender: string,
    receiver: string,
    queryRunner: QueryRunner
  ) {
    try {
      const notification = {
        title: 'You have been booked by librarian',
        message: `You have been helped by ${sender} to book room ${roomName} on ${checkinDate}, from ${checkinTime} to ${checkoutTime}.`,
      };

      const _receiver = await this.accountService.getRoleOfAccount(receiver);
      if (_receiver.fcmToken) {
        const message = {
          data: {
            score: '850',
            time: '2:45',
          },
          notification: {
            title: 'FLBRMS',
            body: 'You have been booked by librarian',
          },
        };
        await admin
          .messaging()
          .sendToDevice(_receiver.fcmToken, message)
          .then((response) => {
           // console.log('Successfully sent message:', response);
          })
          .catch((error) => {
           // console.log('Error sending message:', error);
          });
      }

      const notificationCreated = await this.repository.createNotification(
        notification,
        queryRunner
      );

      return await this.accountNotificationService.sendNotification(
        notificationCreated.id,
        receiver,
        queryRunner
      );
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ?? 'Error occurred while send notification'
      );
    }
  }

  async updateDevicesNotification(
    checkinDate: string,
    checkinTime: string,
    checkoutTime: string,
    sender: string,
    receiver: string,
    queryRunner: QueryRunner
  ) {
    try {
      const checkinDateFormat = dayjs(checkinDate).format('DD/MM/YYYY');
      const notification = {
        title: 'Your devices has been changed',
        message: `Your devices has been updated by ${sender}. on ${checkinDateFormat}, from ${checkinTime} to ${checkoutTime}.`,
      };

      const _receiver = await this.accountService.getRoleOfAccount(receiver);
      if (_receiver.fcmToken) {
        const message = {
          data: {
            score: '850',
            time: '2:45',
          },
          notification: {
            title: 'FLBRMS',
            body: `Your devices have been changed by ${sender}`,
          },
        };
        await admin
          .messaging()
          .sendToDevice(_receiver.fcmToken, message)
          .then((response) => {
            // console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            // console.log('Error sending message:', error);
          });
      }

      const notificationCreated = await this.repository.createNotification(
        notification,
        queryRunner
      );

      return await this.accountNotificationService.sendNotification(
        notificationCreated.id,
        receiver,
        queryRunner
      );
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ?? 'Error occurred while sending notification'
      );
    }
  }



  async sendCancelRequestNotification(
    request,
    reason,
    queryRunner: QueryRunner
  ) {
    try {
      const checkinDate = dayjs(request.checkinDate).format("DD/MM/YYYY")
      const notification = {
        title: 'Your request booking was cancelled',
        message: `Your reservation request on ${checkinDate}, from ${request.checkinTime} to ${request.checkoutTime} for room ${request.roomName} has been cancelled. Reason is "${reason}"`,
      };

      const _receiver = await this.accountService.getRoleOfAccount(
        request.bookedFor
      );
      if (_receiver.fcmToken) {
        const message = {
          data: {
            score: '850',
            time: '2:45',
          },
          notification: {
            title: 'FLBRMS',
            body: 'Your request booking was cancelled',
          },
        };
        await admin
          .messaging()
          .sendToDevice(_receiver.fcmToken, message)
          .then((response) => {
            //console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            //console.log('Error sending message:', error);
          });
      }

      const notificationCreated = await this.repository.createNotification(
        notification,
        queryRunner
      );

      return await this.accountNotificationService.sendNotification(
        notificationCreated.id,
        request.bookedFor,
        queryRunner
      );
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ?? 'Error occurred while send notification'
      );
    }
  }

  async sendReplyFeedbackNotification(
    payload: {
      status: string;
      replier: string;
      receiver: string;
      replyMess: string;
    },
    queryRunner: QueryRunner
  ) {
    try {
      let notification = {title: '', message: ''};
      if (payload.status === 'RESOLVE') {
        notification = {
          title: 'Your feedback has been resolved',
          message: `Your feedback has been addressed by ${payload.replier}. The solution given is: ${payload.replyMess}`,
        };
      } else {
        notification = {
          title: 'Your feedback has been rejected',
          message: `Your feedback has been rejected by ${payload.replier}. The reason given is: ${payload.replyMess}`,
        };
      }

      const _receiver = await this.accountService.getRoleOfAccount(
        payload.receiver
      );
      if (_receiver.fcmToken) {
        const message = {
          data: {
            score: '850',
            time: '2:45',
          },
          notification: {
            title: 'FLBRMS',
            body: notification.title,
          },
        };
        await admin
          .messaging()
          .sendToDevice(_receiver.fcmToken, message)
          .then((response) => {
            //console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            //console.log('Error sending message:', error);
          });
      }

      const notificationCreated = await this.repository.createNotification(
        notification,
        queryRunner
      );
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ?? 'Error occurred while send notification'
      );
    }
  }

  async getDetailNotificationId(
    id: string,
    userId: string
  ): Promise<Notification> {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Notification does not found with the provided id'
        );
      }
      const noti = await this.repository.findById(id);
      // if (noti.receiver !== userId) {
      //   throw new BadRequestException(
      //     `You can't read other people's notifications`
      //   );
      // }
      return noti;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }
}
