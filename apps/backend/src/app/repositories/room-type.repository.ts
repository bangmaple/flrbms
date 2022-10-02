import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {Repository} from 'typeorm';
import {RoomType} from '../models/room-type.entity';
import {PaginationParams} from '../dto/pagination.dto';
import {Accounts} from '../models';

import {paginateRaw, Pagination,} from 'nestjs-typeorm-paginate';
import {MasterDataAddRequestPayload} from '../payload/request/master-data-add.request.payload';
import {BadRequestException, Logger} from '@nestjs/common';
import {DeviceTypeService} from '../services/device-type.service';

@CustomRepository(RoomType)
export class RoomTypeRepository extends Repository<RoomType> {
  private readonly logger = new Logger(DeviceTypeService.name);

  existsById(id: string): Promise<boolean> {
    return this.createQueryBuilder('rt')
      .select('COUNT(1)', 'count')
      .where('rt.id = :id', {id: id})
      .getRawOne()
      .then((data) => data?.count > 0);
  }

  async isExistedByNameActive(name: string): Promise<boolean> {
    return this.createQueryBuilder('rt')
      .select('COUNT(rt.name)')
      .where('rt.name = :name', {name})
      .andWhere('rt.deleted_at IS NULL')
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  async isExistedByNameActiveUpdate(name: string, id: string): Promise<boolean> {
    return this.createQueryBuilder('rt')
      .select('COUNT(rt.name)')
      .where('rt.name = :name', {name})
      .andWhere('rt.deleted_at IS NULL')
      .andWhere('rt.id != :id', {id})
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  findRoomTypesByPagination(
    pagination: PaginationParams
  ): Promise<Pagination<RoomType>> {
    const query = this.createQueryBuilder('rt')
      .select('rt.id', 'id')
      .addSelect('rt.name', 'name')
      .where('rt.deleted_at IS NULL')
      .andWhere('rt.name ILIKE :search', {
        search: `%${pagination.search?.trim() || ''}%`,
      })
      .orderBy(pagination.sort, pagination.dir as 'ASC' | 'DESC');
    return paginateRaw<RoomType>(query, {
      page: pagination.page,
      limit: pagination.limit,
    });
  }

  findRoomTypeName(): Promise<RoomType[]> {
    return this.createQueryBuilder('rt')
      .select('rt.id', 'id')
      .addSelect('rt.name', 'name')
      .andWhere('rt.deleted_at IS NULL')
      .getRawMany<RoomType>();
  }

  async findById(id: string): Promise<RoomType> {
    return this.createQueryBuilder('rt')
      .select('rt.id', 'id')
      .addSelect('rt.name', 'name')
      .addSelect('rt.description', 'description')
      .addSelect('a.username', 'createdBy')
      .addSelect('rt.created_at', 'createdAt')
      .addSelect('aa.username', 'updatedBy')
      .addSelect('rt.updated_at', 'updatedAt')
      .innerJoin(Accounts, 'a', 'a.id = rt.created_by')
      .leftJoin(Accounts, 'aa', 'aa.id = rt.updated_by')
      .where('rt.id = :id', {id: id})
      .andWhere('rt.deleted_at IS NULL')
      .getRawOne<RoomType>();
  }

  // async get(id: string): Promise<RoomType> {
  //   return this.createQueryBuilder('rt')
  //     .select('rt.id', 'id')
  //     .addSelect('rt.name', 'name')
  //     .addSelect('rt.description', 'description')
  //     .addSelect('rt.created_by', 'createdBy')
  //     .addSelect('rt.created_at', 'createdAt')
  //     .addSelect('rt.updated_by', 'updatedBy')
  //     .addSelect('rt.updated_at', 'updatedAt')
  //     .addSelect('rt.deleted_by', 'deletedBy')
  //     .addSelect('rt.deleted_at', 'deletedAt')

  //     .where('rt.id = :id', { id: id })
  //     .getRawOne<RoomType>();
  // }

  async addNew(
    accountId: string,
    payload: MasterDataAddRequestPayload
  ): Promise<RoomType> {
    try {
      const roomType = await this.save({
        name: payload.name.trim(),
        description: payload.description,
        createdBy: accountId,
        createdAt: new Date(),
      });
      return roomType;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }

  async updateById(
    accountId: string,
    roomTypeId: string,
    payload: MasterDataAddRequestPayload
  ) {
    const oldData = await this.findOneOrFail({
      where: {
        id: roomTypeId,
      }
    })
    return this.save(
      {
        ...oldData,
        id: roomTypeId,
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

  async deleteById(accountId: string, id: string) {
    const isDeleted = await this.createQueryBuilder('room_type')
      .update({
        deletedAt: new Date(),
        deletedBy: accountId,
      })
      .where('room_type.id = :id', {id: id})
      .useTransaction(true)
      .execute();
    if (isDeleted.affected > 0) {
      return this.findOneOrFail({
        where: {
          id: id,
        },
      });
    }
  }

  findDeletedByPagination(search: string): Promise<RoomType[]> {
    return this.createQueryBuilder('rt')
      .select('rt.id', 'id')
      .addSelect('rt.name', 'name')
      .addSelect('rt.deleted_at', 'deletedAt')
      .addSelect('a.username', 'deletedBy')
      .innerJoin(Accounts, 'a', 'a.id = rt.deleted_by')
      .where('rt.name ILIKE :search', {search: `%${search.trim()}%`})
      .andWhere('rt.deleted_at IS NOT NULL')
      .orderBy('rt.deleted_at', 'DESC')
      .getRawMany<RoomType>();
  }

  async restoreDeletedById(accountId: string, id: string) {
    const isRestored = await this.createQueryBuilder('room_type')
      .update({
        updatedAt: new Date(),
        updatedBy: accountId,
        deletedAt: null,
        deletedBy: null,
      })
      .where('room_type.id = :id', {id: id})
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

  permanentlyDeleteById(id: string) {
    return this.createQueryBuilder('room_type')
      .delete()
      .where('room_type.id = :id', {id: id})
      .useTransaction(true)
      .execute();
  }
}
