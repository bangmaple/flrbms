import {QueryRunner, Repository} from 'typeorm';
import {Accounts, Holidays, Rooms} from '../models';
import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {HolidayAddRequestPayload} from '../payload/request/holidays-add.request.payload';
import {paginateRaw} from 'nestjs-typeorm-paginate';
import {PaginationParams} from '../dto/pagination.dto';

@CustomRepository(Holidays)
export class HolidaysRepository extends Repository<Holidays> {
  getHolidayDeletedByName(name: string) {
    return this.createQueryBuilder('holidays')
      .select('holidays.id', 'id')
      .where('holidays.deleted_at IS NOT NULL')
      .andWhere('holidays.name = :name', {name})
      .getRawOne();
  }

  async createNewHoliday(
    accountId: string,
    payload: HolidayAddRequestPayload,
    queryRunner: QueryRunner
  ): Promise<Holidays> {
    return queryRunner.manager.save(
      Holidays,
      {
        name: payload.name.trim(),
        description: payload.description,
        dateStart: payload.dateStart,
        dateEnd: payload.dateEnd,
        createdBy: accountId,
        createdAt: new Date(),
      },
      {
        transaction: true,
      }
    );
  }

  async getHolidayMini(today: string): Promise<Holidays[]> {
    return this.createQueryBuilder('holidays')
      .select('holidays.date_start', 'startDate')
      .addSelect('holidays.date_end', 'endDate')
      .where('holidays.deleted_at IS NULL')
      .andWhere('holidays.date_end > :today', {today})
      .orderBy('holidays.date_start', 'ASC')
      .getRawMany<Holidays>();
  }

  async isExistedByNameActive(name: string): Promise<boolean> {
    return this.createQueryBuilder('holidays')
      .select('COUNT(holidays.name)')
      .where('holidays.name = :name', {name})
      .andWhere('holidays.deleted_at IS NULL')
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  async existsById(id: string): Promise<boolean> {
    return this.createQueryBuilder('holidays')
      .select('COUNT(holidays.name)')
      .where('holidays.id = :id', {id})
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  async checkIfHolidayIsDeletedById(id: string): Promise<boolean> {
    return this.createQueryBuilder('holidays')
      .select('holidays.deleted_at')
      .where('holidays.id = :id', {id: id})
      .getRawOne<boolean>()
      .then((data) => (data ? data['deleted_at'] : true));
  }

  async deleteById(accountId: string, id: string, queryRunner: QueryRunner) {
    const oldData = await this.findOneOrFail({
      where: {
        id: id,
      },
    });
    return queryRunner.manager.save(Holidays, {
      ...oldData,
      deletedAt: new Date(),
      deletedBy: accountId,
    });
  }

  async restoreDeletedHolidayIsDuplicateName(
    holiday: Holidays,
    accountId: string,
    id: string,
    queryRunner: QueryRunner
  ) {
    return queryRunner.manager.save(Holidays, {
      id: id,
      name: holiday.name,
      description: holiday.description,
      dateStart: holiday.dateStart,
      dateEnd: holiday.dateEnd,
      deletedBy: null,
      deletedAt: null,
      createdBy: accountId,
      createdAt: new Date(),
      updatedBy: accountId,
      updatedAt: new Date(),
    });
  }

  async restoreDeletedHolidayById(
    id: string,
    accountId: string,
    queryRunner: QueryRunner
  ) {
    const oldData = await this.findOneOrFail({
      where: {
        id: id,
      },
    });
    return queryRunner.manager.save(Holidays, {
      ...oldData,
      deletedAt: null,
      deletedBy: null,
      updatedAt: new Date(),
      updatedBy: accountId,
    });
  }

  async isExistedByNameActiveUpdate(
    name: string,
    id: string
  ): Promise<boolean> {
    return this.createQueryBuilder('holidays')
      .select('COUNT(holidays.name)')
      .where('holidays.name = :name', {name})
      .andWhere('holidays.deleted_at IS NULL')
      .andWhere('holidays.id != :id', {id})
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  async updateById(
    accountId: string,
    holidayId: string,
    payload: HolidayAddRequestPayload,
    queryRunner: QueryRunner
  ) {
    const oldData = await this.findOneOrFail({
      where: {
        id: holidayId,
      },
    });
    return queryRunner.manager.save(
      Holidays,
      {
        ...oldData,
        id: holidayId,
        name: payload.name.trim(),
        description: payload.description,
        dateStart: payload.dateStart,
        dateEnd: payload.dateEnd,
        updatedBy: accountId,
        updatedAt: new Date(),
      },
      {
        transaction: true,
      }
    );
  }

  isHoliday(
    dateStart: string,
    dateEnd: string,
    holidayId: string
  ): Promise<boolean> {
    const query = this.createQueryBuilder('holidays')
      .select('COUNT(1)', 'count')
      .where(
        '((holidays.date_start <= :dateStart AND holidays.date_end >= :dateStart) ' +
        'OR (holidays.date_start <= :dateEnd AND holidays.date_end >= :dateEnd) ' +
        'OR (holidays.date_start > :dateStart AND holidays.date_start < :dateEnd))',
        {dateStart, dateEnd}
      )
      .andWhere("holidays.deleted_by IS NULL")
      .andWhere("holidays.deleted_at IS NULL")
    if (holidayId) {
      query.andWhere('holidays.id != :holidayId', {holidayId});
    }
    return query.getRawOne<{ count: number }>().then((data) => data?.count > 0);
  }

  searchHoliday(payload: PaginationParams) {
    const query = this.createQueryBuilder('holidays')
      .leftJoin(Accounts, 'a', 'holidays.created_by = a.id')
      .leftJoin(Accounts, 'aa', 'holidays.updated_by = aa.id')
      .select('holidays.id', 'id')
      .addSelect('holidays.name', 'name')
      .addSelect('holidays.description', 'description')
      .addSelect('holidays.date_start', 'dateStart')
      .addSelect('holidays.date_end', 'dateEnd')
      .addSelect('holidays.created_at', 'createdAt')
      .addSelect('holidays.updated_at', 'updatedAt')
      .addSelect('a.username', 'createdBy')
      .addSelect('aa.username', 'updatedBy')
      .where('(holidays.name ILIKE :search)', {
        search: `%${payload.search?.trim() || ''}%`,
      })
      .andWhere(`holidays.deleted_at IS NULL`)
      .orderBy(payload.sort, payload.dir as 'ASC' | 'DESC');
    return paginateRaw<Holidays>(query, {
      limit: payload.limit,
      page: payload.page,
    });
  }

  async findById(id: string): Promise<Holidays> {
    return (
      this.createQueryBuilder('holidays')
        .select('holidays.id', 'id')
        .addSelect('holidays.name', 'name')
        .addSelect('holidays.description', 'description')
        .addSelect('holidays.date_start', 'dateStart')
        .addSelect('holidays.date_end', 'dateEnd')
        .addSelect('holidays.created_at', 'createdAt')
        .addSelect('a.username', 'createdBy')
        .addSelect('holidays.updated_at', 'updatedAt')
        .addSelect('aa.username', 'updatedBy')
        .leftJoin(Accounts, 'a', 'holidays.created_by = a.id')
        .leftJoin(Accounts, 'aa', 'holidays.updated_by = aa.id')
        // .where('rooms.disabled_at IS NULL')
        .andWhere('holidays.deleted_at IS NULL')
        .andWhere('holidays.id = :holidayId', {holidayId: id})
        .getRawOne<Holidays>()
    );
  }

  findDeletedHolidays(search: string) {
    return this.createQueryBuilder(`holidays`)
      .select('holidays.id', 'id')
      .addSelect('holidays.name', 'name')
      .addSelect('holidays.deleted_at', 'deletedAt')
      .addSelect('a.username', 'deletedBy')
      .innerJoin(Accounts, 'a', 'holidays.deleted_by = a.id')
      .where(`holidays.deleted_at IS NOT NULL`)
      .andWhere('holidays.name ILIKE :name', {name: `%${search.trim()}%`})
      .orderBy('holidays.deleted_at', 'DESC')
      .getRawMany<Holidays>();
  }

  async findAllHolidaysInDayArray() {
    return this.createQueryBuilder('holidays')
      .select('holidays.name', 'name')
      .addSelect('holidays.date_start', 'start')
      .addSelect('holidays.date_end', 'end')
      .where('holidays.deleted_at IS NULL')
      .andWhere('holidays.deleted_by IS NULL')
      .getRawMany();
  }
}
