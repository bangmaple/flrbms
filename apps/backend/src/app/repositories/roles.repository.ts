import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {Roles} from '../models/role.entity';
import {Repository} from 'typeorm';
import {Accounts} from '../models';
import {IPaginationMeta, paginateRaw, Pagination} from 'nestjs-typeorm-paginate';
import {PaginationParams} from '../dto/pagination.dto';
import {MasterDataAddRequestPayload} from '../payload/request/master-data-add.request.payload';

@CustomRepository(Roles)
export class RolesRepository extends Repository<Roles> {
  async existsById(id: string): Promise<boolean> {
    return this.createQueryBuilder('r')
      .select('COUNT(1)', 'count')
      .where('r.id = :id', {id: id})
      .getRawOne()
      .then((data) => data?.count > 0);
  }

  async isExistedByName(name: string): Promise<boolean> {
    return this.createQueryBuilder('rooms')
      .select('COUNT(rooms.name)')
      .where('rooms.name = :name', {name})
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  async findByPagination(
    pagination: PaginationParams
  ): Promise<Pagination<Roles>> {
    const query = this.createQueryBuilder('r')
      .select('r.id', 'id')
      .addSelect('r.name', 'name')
      .addSelect('r.description', 'description')
      .where('r.deleted_at IS NULL')
      .andWhere('r.name ILIKE :search', {
        search: `%${pagination.search?.trim() || ''}%`,
      })
      .orderBy(pagination.sort, pagination.dir as 'ASC' | 'DESC');
    return paginateRaw<Roles, IPaginationMeta>(query, {
      limit: pagination.limit,
      page: pagination.page,
    });
  }

  findRoleName(): Promise<Roles[]> {
    return this.createQueryBuilder('roles')
      .select('roles.id', 'id')
      .addSelect('roles.name', 'name')
      .andWhere('roles.deleted_at IS NULL')
      .getRawMany<Roles>();
  }

  findById(id: string): Promise<Roles> {
    return this.createQueryBuilder('r')
      .select('r.id', 'id')
      .addSelect('r.name', 'name')
      .addSelect('r.description', 'description')
      .addSelect('r.created_at', 'createdAt')
      .addSelect('r.updated_at', 'updatedAt')
      .addSelect('a.username', 'createdBy')
      .addSelect('aa.username', 'updatedBy')
      .innerJoin(Accounts, 'a', 'a.id = r.created_by')
      .leftJoin(Accounts, 'aa', 'aa.id = r.updated_by')
      .where('r.id = :id', {id: id})
      .andWhere('r.deleted_at IS NULL')
      .getRawOne<Roles>();
  }

  // async get(id: string): Promise<Roles> {
  //   return this.createQueryBuilder('roles')
  //     .select('roles.id', 'id')
  //     .addSelect('roles.name', 'name')
  //     .addSelect('roles.description', 'description')
  //     .addSelect('roles.created_by', 'createdBy')
  //     .addSelect('roles.created_at', 'createdAt')
  //     .addSelect('roles.updated_by', 'updatedBy')
  //     .addSelect('roles.updated_at', 'updatedAt')
  //     .addSelect('roles.deleted_by', 'deletedBy')
  //     .addSelect('roles.deleted_at', 'deletedAt')

  //     .where('roles.id = :id', { id: id })
  //     .getRawOne<Roles>();
  // }

  async addNew(
    accountId: string,
    payload: MasterDataAddRequestPayload
  ): Promise<Roles> {
    return this.save<Roles>(
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

  async updateById(id: string, accountId: string, payload: any) {
    const oldData = await this.findOneOrFail({
      where: {
        id: id,
      },
    });
    return this.save(
      {
        ...oldData,
        id: id,
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
    const isDeleted = await this.createQueryBuilder('role')
      .update({
        deletedAt: new Date(),
        deletedBy: accountId,
        updatedAt: new Date(),
        updatedBy: accountId,
      })
      .where('role.id = :id', {id: id})
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

  getDeletedRoles(search: string): Promise<Roles[]> {
    return this.createQueryBuilder('role')
      .select('role.id', 'id')
      .addSelect('role.name', 'name')
      .addSelect('role.deleted_at', 'deletedAt')
      .addSelect('a.username', 'deletedBy')
      .innerJoin(Accounts, 'a', 'a.id = role.deleted_by')
      .where('role.name ILIKE :search', {search: `%${search.trim()}%`})
      .andWhere('role.deleted_at IS NOT NULL')
      .orderBy('role.deleted_at', 'DESC')
      .getRawMany<Roles>();
  }

  async restoreDeletedById(accountId: string, id: string) {
    const isRestored = await this.createQueryBuilder('role')
      .update({
        updatedAt: new Date(),
        updatedBy: accountId,
        deletedAt: null,
        deletedBy: null,
      })
      .where('role.id = :id', {id: id})
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
    return this.createQueryBuilder('role')
      .delete()
      .where('role.id = :id', {id: id})
      .useTransaction(true)
      .execute();
  }

  findByName(name: string) {
    return this.createQueryBuilder('role')
      .select('role.id', 'id')
      .addSelect('role.name', 'name')
      .addSelect('role.description', 'description')
      .where('role.name = :name', {name: name})
      .andWhere('role.deleted_at IS NULL')
      .andWhere('role.deleted_by IS NULL')
      .getRawOne();
  }

  findNameByAccountId(accountId: string): Promise<string> {
    return this.createQueryBuilder('role')
      .select('role.name', 'name')
      .innerJoin(Accounts, 'a', 'a.role_id = role.id')
      .where('a.id = :accountId', {accountId: accountId})
      .getRawOne().then((res) => res?.name);
  }
}
