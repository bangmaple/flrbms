import {paginateRaw} from 'nestjs-typeorm-paginate';
import {QueryRunner, Repository} from 'typeorm';
import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {Accounts, BookingRequest, FeedbackType, Rooms} from '../models';
import {BookingRoomFeedback} from '../models/booking-room-feedback.entity';
import {BookingFeedbackSendRequestPayload} from '../payload/request/booking-feedback-send.request.payload';
import dayjs = require('dayjs');

@CustomRepository(BookingRoomFeedback)
export class BookingFeedbackRepository extends Repository<BookingRoomFeedback> {
  existsById(id: string): Promise<boolean> {
    return this.createQueryBuilder('f')
      .select('COUNT(1)', 'count')
      .where('f.id = :id', {id: id})
      .getRawOne()
      .then((data) => data?.count > 0);
  }

  isAlreadyFeedback(id: string): Promise<BookingRoomFeedback> {
    return this.createQueryBuilder('fb')
      .select('fb.id', 'id')
      .addSelect('fb.feedback_msg', 'feedbackMess')
      .addSelect('ft.name', 'feedbackType')
      .addSelect('fb.rate_num', 'rateNum')
      .addSelect('fb.booking_room_id', 'bookingRoomId')
      .addSelect('aa.username', 'createdBy')
      .addSelect('fb.created_at', 'createdAt')
      .addSelect('aa.email', 'createdByEmail')
      .innerJoin(FeedbackType, 'ft', 'fb.feedback_type = ft.id')
      .innerJoin(Accounts, 'aa', 'aa.id = fb.created_by')
      .where('fb.booking_room_id = :id', {id: id})
      .getRawOne<BookingRoomFeedback>();
  }

  findByPagination(accountId: string, pagination: any): Promise<any> {
    const query = this.createQueryBuilder('f')
      .select('f.id', 'id')
      .addSelect('f.created_by', 'createdBy')
      .addSelect('f.created_at', 'createdAt')
      .addSelect('f.rate_num', 'rateNum')
      .addSelect('a.username', 'createdByName')
      .addSelect('a.email', 'createdByEmail')
      .addSelect('ft.name', 'feedbackType')
      .addSelect('r.name', 'roomName')
      .innerJoin(BookingRequest, 'br', 'br.id = f.booking_room_id')
      .innerJoin(Rooms, 'r', 'r.id = br.room_id')
      .innerJoin(Accounts, 'a', 'a.id = f.created_by')
      .innerJoin(FeedbackType, 'ft', 'f.feedback_type = ft.id')
      .orderBy(pagination.sort, pagination.dir as 'ASC' | 'DESC');
    if (pagination.search) {
      query.andWhere(
        '(a.username ILIKE :search OR ft.name ILIKE :search OR r.name ILIKE :search)',
        {
          search: `%${pagination.search.trim()}%`,
        }
      );
    }

    if (!pagination || !pagination.page) {
      query.addOrderBy('f.created_at', 'DESC');
    }
    if (pagination.sort) {
      query.orderBy(pagination.sort, pagination.dir as 'ASC' | 'DESC');
    }

    if (pagination.fromDate && pagination.toDate) {
      query
        .andWhere('f.created_at >= :fromDate', {
          fromDate: dayjs(pagination.fromDate).startOf('day').toDate(),
        })
        .andWhere('f.created_at <= :toDate', {
          toDate: dayjs(pagination.toDate).endOf('day').toDate(),
        });
    }

    if (accountId) {
      query.andWhere('f.created_by = :createdBy', {createdBy: accountId});
    }

    if (pagination.star) {
      query.andWhere('f.rate_num IN (:...star)', {
        star: JSON.parse(pagination.star),
      });
    }

    if (pagination.type) {
      query.andWhere('f.feedbackType = :feedbackTypeName', {
        feedbackTypeName: pagination.type,
      });
    }

    if (pagination.room) {
      query.andWhere('f.booking_room_id = :bookingRoomId', {
        bookingRoomId: pagination.room,
      });
    }

    if (!pagination || !pagination.page) {
      return query.getRawMany();
    }

    return paginateRaw<BookingRoomFeedback>(query, {
      page: pagination.page,
      limit: pagination.limit,
    });
  }

  async findById(id: string): Promise<BookingRoomFeedback> {
    return this.createQueryBuilder('fb')
      .select('fb.id', 'id')
      .addSelect('fb.feedback_msg', 'feedbackMess')
      .addSelect('ft.name', 'feedbackType')
      .addSelect('fb.rate_num', 'rateNum')
      .addSelect('fb.booking_room_id', 'bookingRoomId')
      .addSelect('aa.username', 'createdBy')
      .addSelect('fb.created_at', 'createdAt')
      .addSelect('aa.email', 'createdByEmail')
      .innerJoin(FeedbackType, 'ft', 'fb.feedback_type = ft.id')
      .innerJoin(Accounts, 'aa', 'aa.id = fb.created_by')
      .where('fb.id = :id', {id: id})
      .getRawOne<BookingRoomFeedback>();
  }

  async addNew(
    accountId: string,
    payload: BookingFeedbackSendRequestPayload,
    queryRunner: QueryRunner
  ) {
    return queryRunner.manager.save(BookingRoomFeedback, {
      feedbackMessage: payload.message,
      feedbackType: payload.type,
      rateNum: payload.rateNum,
      bookingRoomId: payload.bookingRoomId,
      createdBy: accountId,
      createdAt: new Date(),
    });
  }
}
