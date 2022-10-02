import {paginateRaw, Pagination} from 'nestjs-typeorm-paginate';
import {Repository} from 'typeorm';
import {PaginationParams} from '../dto/pagination.dto';
import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {Accounts} from '../models';
import {FeedbackType} from '../models/feedback-type.entity';
import {MasterDataAddRequestPayload} from '../payload/request/master-data-add.request.payload';

@CustomRepository(FeedbackType)
export class FeedbackTypeRepository extends Repository<FeedbackType> {
  existsById(id: string): Promise<boolean> {
    return this.createQueryBuilder('ft')
      .select('COUNT(1)', 'count')
      .where('ft.id = :id', {id: id})
      .getRawOne()
      .then((data) => data?.count > 0);
  }

  async isExistedByNameAdd(name: string): Promise<boolean> {
    return this.createQueryBuilder('fbt')
      .select('COUNT(fbt.name)')
      .where('fbt.name = :name', {name})
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  async isExistedByNameUpdate(name: string, id: string): Promise<boolean> {
    return this.createQueryBuilder('fbt')
      .select('COUNT(fbt.name)')
      .where('fbt.name = :name', {name})
      .andWhere('fbt.id != :id', {id})
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  findByPagination(
    pagination: PaginationParams
  ): Promise<Pagination<FeedbackType>> {
    const query = this.createQueryBuilder('ft')
      .select('ft.id', 'id')
      .addSelect('ft.name', 'name')
      .where('ft.deleted_at IS NULL')
      .andWhere('ft.name ILIKE :search', {
        search: `%${pagination.search.trim()}%`,
      })
      .orderBy(pagination.sort, pagination.dir as 'ASC' | 'DESC');

    return paginateRaw<FeedbackType>(query, {
      page: pagination.page,
      limit: pagination.limit,
    });
  }

  findFeedbackTypeName(): Promise<FeedbackType[]> {
    return this.createQueryBuilder('ft')
      .select('ft.id', 'id')
      .addSelect('ft.name', 'name')
      .andWhere('ft.deleted_at IS NULL')
      .getRawMany<FeedbackType>();
  }

  async findById(id: string): Promise<FeedbackType> {
    return this.createQueryBuilder('ft')
      .select('ft.id', 'id')
      .addSelect('ft.name', 'name')
      .addSelect('ft.description', 'description')
      .addSelect('a.username', 'createdBy')
      .addSelect('ft.created_at', 'createdAt')
      .addSelect('aa.username', 'updatedBy')
      .addSelect('ft.updated_at', 'updatedAt')
      .innerJoin(Accounts, 'a', 'a.id = ft.created_by')
      .leftJoin(Accounts, 'aa', 'aa.id = ft.updated_by')
      .where('ft.id = :id', {id: id})
      .andWhere('ft.deleted_at IS NULL')
      .getRawOne<FeedbackType>();
  }

  async addNew(
    accountId: string,
    payload: MasterDataAddRequestPayload
  ): Promise<FeedbackType> {
    return this.save<FeedbackType>(
      {
        name: payload.name.trim(),
        description: payload.description,
        createdBy: accountId,
        createdAt: new Date(),
      },
      {
        transaction: true,
      }
    );
  }

  async updateById(
    accountId: string,
    feedbackTypeId: string,
    payload: MasterDataAddRequestPayload
  ) {
    const oldData = await this.findOneOrFail({
      where: {
        id: feedbackTypeId,
      },
    });
    return this.save(
      {
        ...oldData,
        id: feedbackTypeId,
        name: payload.name.trim(),
        description: payload.description,
        updatedBy: accountId,
        updatedAt: new Date(),
      },
      {
        transaction: true,
      }
    );
  }

  async disableById(accountId: string, id: string) {
    const isDisabled = await this.createQueryBuilder('feedback_type')
      .update({
        deletedAt: new Date(),
        deletedBy: accountId,
      })
      .where('feedback_type.id = :id', {id: id})
      .useTransaction(true)
      .execute();
    if (isDisabled.affected > 0) {
      return this.findOneOrFail({
        where: {
          id: id,
        },
      });
    }
  }

  findDisabledByPagination(search: string): Promise<FeedbackType[]> {
    return this.createQueryBuilder('ft')
      .select('ft.id', 'id')
      .addSelect('ft.name', 'name')
      .addSelect('ft.deleted_at', 'deletedAt')
      .addSelect('a.username', 'deletedBy')
      .innerJoin(Accounts, 'a', 'a.id = ft.deleted_by')
      .where('ft.name ILIKE :search', {search: `%${search.trim()}%`})
      .andWhere('ft.deleted_at IS NOT NULL')
      .orderBy('ft.deleted_at', 'DESC')
      .getRawMany<FeedbackType>();
  }

  async restoreDisabledById(accountId: string, id: string) {
    const isRestored = await this.createQueryBuilder('feedback_type')
      .update({
        updatedAt: new Date(),
        updatedBy: accountId,
        deletedAt: null,
        deletedBy: null,
      })
      .where('feedback_type.id = :id', {id: id})
      .useTransaction(true)
      .execute();
    if (isRestored.affected > 0) {
      return this.findOneOrFail({
        where: {
          id: id,
        },
      });
    }
  }

  async checkIfFeedbackTypeIsDisabledById(id: string): Promise<boolean> {
    return this.createQueryBuilder('feedback_type')
      .select('feedback_type.deleted_at')
      .where('feedback_type.id = :id', {id: id})
      .getRawOne<boolean>()
      .then((data) => (data ? data['deleted_at'] : true));
  }

  // async permanentlyDeleteById(id: string) {
  //   return this.createQueryBuilder('ft')
  //     .delete()
  //     .where('ft.id = :id', {id: id})
  //     .useTransaction(true)
  //     .execute();
  // }
}
