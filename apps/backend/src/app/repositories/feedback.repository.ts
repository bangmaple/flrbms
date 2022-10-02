import {paginateRaw, Pagination} from 'nestjs-typeorm-paginate';
import {QueryRunner, Repository} from 'typeorm';
import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {Accounts, Feedback, FeedbackType} from '../models';
import {FeedbackPaginationPayload} from '../payload/request/feedback-pagination.payload';
import {FeedbackReplyRequestPayload} from '../payload/request/feedback-resolve.request.payload';
import {FeedbackSendRequestPayload} from '../payload/request/feedback-send.request.payload';
import dayjs = require('dayjs');

@CustomRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback> {
  existsById(id: string): Promise<boolean> {
    return this.createQueryBuilder('f')
      .select('COUNT(1)', 'count')
      .where('f.id = :id', {id: id})
      .getRawOne()
      .then((data) => data?.count > 0);
  }

  findByPagination(
    accountId: string,
    pagination: FeedbackPaginationPayload
  ): Promise<Pagination<Feedback> | Feedback[]> {
    const query = this.createQueryBuilder('f')
      .select('f.id', 'id')
      .addSelect('f.created_by', 'createdBy')
      .addSelect('f.created_at', 'createdAt')
      .addSelect('f.status', 'status')
      .addSelect('a.username', 'createdByName')
      .addSelect('f.resolved_at', 'resolvedAt')
      .addSelect('f.rejected_at', 'rejectedAt')
      .addSelect('ft.name', 'feedbackTypeName')
      .innerJoin(Accounts, 'a', 'a.id = f.created_by')
      .leftJoin(FeedbackType, 'ft', 'ft.id = f.feedback_type_id')
      .where('f.deleted_at IS NULL')
      .andWhere('f.deleted_by IS NULL');
    if (pagination.search) {
      query.andWhere('(a.username ILIKE :search OR ft.name ILIKE :search)', {
        search: `%${pagination.search.trim()}%`,
      });
    }

    if (!pagination || !pagination.page) {
      query.addOrderBy('f.created_at', 'DESC');
    }
    if (pagination.sort) {
      query.orderBy('f.' + pagination.sort, pagination.dir as 'ASC' | 'DESC');
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

    if (pagination.status) {
      query.andWhere('f.status IN (:...status)', {
        status: JSON.parse(pagination.status),
      });
    }

    if (pagination.type) {
      query.andWhere('ft.name = :feedbackTypeName', {
        feedbackTypeName: pagination.type,
      });
    }

    if (!pagination || !pagination.page) {
      return query.getRawMany();
    }

    return paginateRaw<Feedback>(query, {
      page: pagination.page,
      limit: pagination.limit,
    });
  }

  async findById(id: string): Promise<Feedback> {
    return this.createQueryBuilder('fb')
      .select('fb.id', 'id')
      .addSelect('fb.feedback_msg', 'feedbackMess')
      .addSelect('fb.status', 'status')
      .addSelect('fb.reply_msg', 'replyMess')
      .addSelect('a.username', 'resolvedBy')
      .addSelect('fb.resolved_at', 'resolvedAt')
      .addSelect('aa.username', 'createdBy')
      .addSelect('fb.created_at', 'createdAt')
      .addSelect('aaa.username', 'rejectedBy')
      .addSelect('fb.rejected_at', 'rejectedAt')
      .addSelect('ft.name', 'feedbackType')
      .leftJoin(FeedbackType, 'ft', 'ft.id = fb.feedback_type_id')
      .leftJoin(Accounts, 'a', 'a.id = fb.resolved_by')
      .innerJoin(Accounts, 'aa', 'aa.id = fb.created_by')
      .leftJoin(Accounts, 'aaa', 'aaa.id = fb.rejected_by')
      .where('fb.id = :id', {id: id})
      .andWhere('fb.deleted_at IS NULL')
      .getRawOne<Feedback>();
  }


  async getCountRequestFeedbacks() {
    return await this.query(`SELECT COUNT(1) as count FROM feedback fb WHERE fb.status = 'PENDING' UNION ALL
                                    SELECT COUNT(1) FROM feedback fb WHERE fb.status = 'RESOLVED' UNION ALL
                                    SELECT COUNT(1) FROM feedback fb WHERE fb.status = 'REJECTED'`);
  }

  async getCountRequestFeedbacksCreatedBy(id: string) {
    return await this.query(`SELECT COUNT(1) as count FROM feedback fb WHERE fb.status = 'PENDING' AND fb.created_by = '${id}' UNION ALL
                                    SELECT COUNT(1) FROM feedback fb WHERE fb.status = 'RESOLVED' AND fb.created_by = '${id}' UNION ALL
                                    SELECT COUNT(1) FROM feedback fb WHERE fb.status = 'REJECTED' AND fb.created_by = '${id}'`);
  }

  async addNew(
    accountId: string,
    payload: FeedbackSendRequestPayload,
    queryRunner: QueryRunner
  ): Promise<Feedback> {
    return queryRunner.manager.save(
      Feedback,
      {
        feedbackMessage: payload.message,
        feedbackTypeId: payload.feedbackTypeId,
        createdBy: accountId,
        createdAt: new Date(),
        status: 'PENDING',
      },
      {
        transaction: true,
      }
    );
  }

  async resolveById(
    accountId: string,
    feedbackId: string,
    payload: FeedbackReplyRequestPayload,
    queryRunner: QueryRunner
  ) {
    const oldData = await this.findOneOrFail({
      where: {
        id: feedbackId,
      },
    });
    return queryRunner.manager.save(
      Feedback,
      {
        ...oldData,
        id: feedbackId,
        replyMessage: payload.replyMessage,
        status: 'RESOLVED',
        resolvedBy: accountId,
        resolvedAt: new Date(),
      },
      {
        transaction: true,
      }
    );
  }

  async rejectById(
    accountId: string,
    feedbackId: string,
    payload: FeedbackReplyRequestPayload,
    queryRunner: QueryRunner
  ) {
    const oldData = await this.findOneOrFail({
      where: {
        id: feedbackId,
      },
    });
    return queryRunner.manager.save(
      Feedback,
      {
        ...oldData,
        id: feedbackId,
        replyMessage: payload.replyMessage,
        status: 'REJECTED',
        rejectedBy: accountId,
        rejectedAt: new Date(),
      },
      {
        transaction: true,
      }
    );
  }
}
