import {BadRequestException, forwardRef, Inject, Injectable, Logger,} from '@nestjs/common';
import {DataSource} from 'typeorm';
import {PaginationParams} from '../dto/pagination.dto';
import {BookingRoomFeedback} from '../models';
import {BookingFeedbackSendRequestPayload} from '../payload/request/booking-feedback-send.request.payload';
import {BookingFeedbackRepository} from '../repositories/booking-feedback.repository';
import {BookingRoomService} from './booking-room.service';
import {AccountRepository} from '../repositories';
import {AccountsService} from "./accounts.service";
import {RoleService} from "./role.service";

@Injectable()
export class BookingFeedbackService {
  private readonly logger = new Logger(BookingFeedbackService.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => BookingFeedbackRepository))
    private readonly repository: BookingFeedbackRepository,
    @Inject(forwardRef(() => BookingRoomService))
    private readonly bookingRoomService: BookingRoomService,

    private readonly roleService: RoleService
  ) {
  }

  async isAlreadyFeedback(id: string) {
    return await this.repository.isAlreadyFeedback(id);
  }

  async getAllFeedbacks(accountId: string, param: PaginationParams) {
    if (param.fromDate > param.toDate) {
      throw new BadRequestException(`"From date" must be less than "To date"`);
    }
    try {
      let result;
      const roleName = await this.roleService.findNameByAccountId(accountId);
      if (roleName === 'Staff') {
        result = await this.repository.findByPagination(accountId, param);
      } else {
        result = await this.repository.findByPagination(undefined, param);
      }
      if (
        result.meta?.totalPages > 0 &&
        result.meta?.currentPage > result.meta?.totalPages
      ) {
        throw new BadRequestException('Current page is over');
      }
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }

  async addNewFeedback(
    accountId: string,
    payload: BookingFeedbackSendRequestPayload
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const request = await this.bookingRoomService.getInforToFeedback(
        payload.bookingRoomId
      );
      if (request.userId !== accountId) {
        throw new BadRequestException(
          "You didn't use this request, so you can't feedback"
        );
      } else {
        if (request.status !== 'CHECKED_OUT') {
          throw new BadRequestException(
            "You can't send feedback until you check out of the room"
          );
        }
      }

      const isFeedback = await this.repository.isAlreadyFeedback(
        payload.bookingRoomId
      );
      if (isFeedback) {
        throw new BadRequestException('You already feedback this request');
      }

      const feedback = await this.repository.addNew(
        accountId,
        payload,
        queryRunner
      );

      await queryRunner.commitTransaction();
      return feedback;
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getFeedbackById(id: string): Promise<BookingRoomFeedback> {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Feedback does not found with the provided id'
        );
      }
      const data = await this.repository.findById(id);
      return data;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }
}
