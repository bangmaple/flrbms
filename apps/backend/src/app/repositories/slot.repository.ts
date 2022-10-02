import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {Slot} from '../models/slot.entity';
import {QueryRunner, Repository} from 'typeorm';
import {PaginationParams} from '../dto/pagination.dto';
import {paginateRaw, Pagination} from 'nestjs-typeorm-paginate';
import {Accounts} from '../models';
import {SlotsRequestPayload} from '../payload/request/slot-add.request.payload';

@CustomRepository(Slot)
export class SlotRepository extends Repository<Slot> {
  existsById(id: string): Promise<boolean> {
    return this.createQueryBuilder('sl')
      .select('COUNT(1)', 'count')
      .where('sl.id = :id', {id: id})
      .getRawOne()
      .then((data) => data?.count > 0);
  }

  isHaveSlotSameNameActive(name: string): Promise<boolean> {
    return this.createQueryBuilder('sl')
      .select('COUNT(1)', 'count')
      .where('sl.name ILIKE :name', {name: name})
      .andWhere('sl.deleted_by IS NULL')
      .andWhere('sl.deleted_at IS NULL')
      .getRawOne()
      .then((data) => data?.count > 0);
  }

  isHaveSlotSameNumActive(slotNum: number): Promise<boolean> {
    return this.createQueryBuilder('sl')
      .select('COUNT(1)', 'count')
      .where('sl.slotNum = :slotNum', {slotNum: slotNum})
      .andWhere('sl.deleted_by IS NULL')
      .andWhere('sl.deleted_at IS NULL')
      .getRawOne()
      .then((data) => data?.count > 0);
  }

  findByPagination(params: PaginationParams): Promise<Pagination<Slot>> {
    const query = this.createQueryBuilder('s')
      .select('s.id', 'id')
      .addSelect('s.time_start', 'timeStart')
      .addSelect('s.time_end', 'timeEnd')
      .addSelect('s.name', 'name')
      .where('s.deleted_at IS NULL')
      .andWhere('LOWER(s.name) LIKE LOWER(:search)', {
        search: `%${params.search || ''}%`,
      })
      .orderBy('s.slot_num', 'ASC')
      .orderBy(params.sort, params.dir as 'ASC' | 'DESC');
    return paginateRaw<Slot>(query, {
      page: params.page,
      limit: params.limit,
    });
  }

  async getNumOfSlot(id: string): Promise<{ slotNum: number, timeStart: string, name: string }> {
    return this.createQueryBuilder('slot')
      .select('slot.slot_num', 'slotNum')
      .addSelect('slot.time_start', 'timeStart')
      .addSelect('slot.name', 'name')
      .where('slot.id = :slotId', {slotId: id})
      .getRawOne();
  }

  async findSlotNames(): Promise<Slot[]> {
    return this.createQueryBuilder('slots')
      .select('slots.name', 'name')
      .addSelect('slots.id', 'id')
      .addSelect('slots.slot_num', 'slotNum')
      .addSelect('slots.time_start', 'timeStart')
      .addSelect('slots.time_end', 'timeEnd')
      .where('slots.deleted_by IS NULL')
      .andWhere('slots.deleted_at IS NULL')
      .orderBy('slot_num', 'ASC')
      .getRawMany<Slot>();
  }

  async findById(id: string): Promise<Slot> {
    return this.createQueryBuilder('s')
      .select('s.id', 'id')
      .addSelect('s.name', 'name')
      .addSelect('s.slot_num', 'slotNum')
      .addSelect('s.time_start', 'timeStart')
      .addSelect('s.time_end', 'timeEnd')
      .addSelect('a.username', 'createdBy')
      .addSelect('s.created_at', 'createdAt')
      .addSelect('s.deleted_at', 'deletedAt')
      .addSelect('aa.username', 'updatedBy')
      .addSelect('s.updated_at', 'updatedAt')
      .addSelect('s.description', 'description')
      .innerJoin(Accounts, 'a', 'a.id = s.created_by')
      .leftJoin(Accounts, 'aa', 'aa.id = s.updated_by')
      .where('s.id = :id', {id: id})
      .andWhere('s.deleted_at IS NULL')
      .getRawOne<Slot>();
  }

  findAll(): Promise<Slot[]> {
    return this.find({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
      order: {
        ['slotNum']: 'ASC',
      },
    });
  }

  async addNew(
    accountId: string,
    payload: SlotsRequestPayload
  ): Promise<Slot> {
    return this.save<Slot>(
      {
        name: payload.name.trim(),
        slotNum: payload.slotNum,
        timeStart: payload.timeStart,
        timeEnd: payload.timeEnd,
        description: payload.description,
        createdBy: accountId,
        createdAt: new Date(),
      },
      {
        transaction: true,
      }
    );
  }

  async deleteById(accountId: string, id: string, queryRunner: QueryRunner) {
    return await queryRunner.manager.save(Slot, {
      id: id,
      deletedBy: accountId,
      deletedAt: new Date(),
    });
  }

  findDeletedByPagination(search: string): Promise<Slot[]> {
    return this.createQueryBuilder('sl')
      .select('sl.id', 'id')
      .addSelect('sl.name', 'name')
      .addSelect('sl.time_start', 'timeStart')
      .addSelect('sl.time_end', 'timeEnd')
      .addSelect('sl.deleted_at', 'deletedAt')
      .addSelect('a.username', 'deletedBy')
      .innerJoin(Accounts, 'a', 'a.id = sl.deleted_by')
      .where('sl.name ILIKE :search', {search: `%${search.trim()}%`})
      .andWhere('sl.deleted_at IS NOT NULL')
      .orderBy('sl.deleted_at', 'DESC')
      .getRawMany<Slot>();
  }

  async restoreDeletedById(accountId: string, id: string) {
    const isRestored = await this.createQueryBuilder('slot')
      .update({
        updatedAt: new Date(),
        updatedBy: accountId,
        deletedAt: null,
        deletedBy: null,
      })
      .where('slot.id = :id', {id: id})
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

}
