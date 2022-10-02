import {InsertResult, QueryRunner, Repository} from 'typeorm';
import {Accounts} from '../models';
import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {paginateRaw} from 'nestjs-typeorm-paginate';
import {Roles} from '../models/role.entity';
import {AccountsPaginationParams} from '../dto/accounts-pagination.dto';
import {AccountAddRequestPayload} from '../payload/request/account-add.request.payload';
import {CreateAccountRequestPayload} from '../payload/request/create-account-request-payload.dto';

@CustomRepository(Accounts)
export class AccountRepository extends Repository<Accounts> {
  existsById(id: string): Promise<boolean> {
    return this.createQueryBuilder('accounts')
      .select('COUNT(1)', 'count')
      .where('accounts.id = :id', {id: id})
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  existsByUsername(username: string): Promise<boolean> {
    return this.createQueryBuilder('accounts')
      .select('COUNT(1)', 'count')
      .where('accounts.username = :username', {username: username})
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  existsByEmail(email: string): Promise<boolean> {
    return this.createQueryBuilder('accounts')
      .select('COUNT(1)', 'count')
      .where('accounts.email = :email', {email: email})
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  existsByPhone(phone: string): Promise<boolean> {
    return this.createQueryBuilder('accounts')
      .select('COUNT(1)', 'count')
      .where('accounts.phone = :phone', {phone: phone})
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  async getRoleOfAccount(
    id: string
  ): Promise<{ role_name: string; username: string; fcmToken: string }> {
    return this.createQueryBuilder('account')
      .select('role.name', 'role_name')
      .addSelect('account.username', 'username')
      .addSelect('account.fcm_token', 'fcmToken')
      .innerJoin(Roles, 'role', 'role.id = account.role_id')
      .where('account.deleted_at IS NULL')
      .andWhere('account.id = :accountId', {accountId: id})
      .getRawOne();
  }

  async findUserNames(): Promise<Accounts[]> {
    return this.createQueryBuilder('a')
      .select('a.username', 'name')
      .addSelect('a.id', 'id')
      .where('a.disabled_at IS NULL')
      .andWhere('a.deleted_at IS NULL')
      .orderBy('a.username', 'ASC')
      .getRawMany<Accounts>();
  }

  async checkIfAccountIsDeletedById(id: string): Promise<boolean> {
    return this.createQueryBuilder('accounts')
      .select('accounts.deleted_at')
      .where('accounts.id = :id', {id: id})
      .getRawOne<boolean>()
      .then((data) => (data ? data['deleted_at'] : true));
  }

  async checkIfAccountIsDisabledById(id: string): Promise<boolean> {
    return this.createQueryBuilder('accounts')
      .select('accounts.disabled_at')
      .where('accounts.id = :id', {id: id})
      .getRawOne<boolean>()
      .then((data) => (data ? data['disabled_at'] : true));
  }

  async isDeletedByUsername(username: string): Promise<boolean> {
    return this.createQueryBuilder('accounts')
      .select('accounts.deleted_at')
      .where('accounts.username = :username', {username: username})
      .getRawOne<boolean>()
      .then((data) => (data ? data['deleted_at'] : true));
  }

  async isDisabledByUsername(username: string): Promise<boolean> {
    return this.createQueryBuilder('accounts')
      .select('accounts.disabled_at')
      .where('accounts.username = :username', {username: username})
      .getRawOne<boolean>()
      .then((data) => (data ? data['disabled_at'] : true));
  }

  findKeycloakIdByGoogleId(googleId: string): Promise<string> {
    return this.createQueryBuilder('accounts')
      .select('accounts.keycloak_id', 'keycloakId')
      .where('accounts.google_id = :googleId', {googleId: googleId})
      .getRawOne()
      .then((data) => data?.keycloakId);
  }

  async isExistedByUsername(username: string): Promise<boolean> {
    return this.createQueryBuilder('accounts')
      .select('COUNT(accounts.username)')
      .where('accounts.username = :username', {username})
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  async checkIfUserAlreadyHasAvatar(id: string): Promise<boolean> {
    const data = await this.createQueryBuilder('accounts')
      .select('COUNT(accounts.avatar)')
      .where('accounts.id = :id', {id: id})
      .getRawOne<Array<object>>();
    return data.length > 0;
  }

  findByKeycloakId(keycloakId: string): Promise<Accounts> {
    return this.createQueryBuilder('accounts')
      .select('accounts.id', 'id')
      .addSelect('accounts.keycloak_id', 'keycloakId')
      .addSelect('accounts.google_id', 'googleId')
      .addSelect('accounts.username', 'username')
      .addSelect('accounts.email', 'email')
      .addSelect('accounts.fullname', 'fullname')
      .addSelect('accounts.phone', 'phone')
      .addSelect('accounts.avatar', 'avatar')
      .addSelect('r.name', 'role')
      .addSelect('accounts.description', 'description')
      .innerJoin(Roles, 'r', 'r.id = accounts.role_id')
      .where('accounts.keycloak_id = :keycloakId', {keycloakId: keycloakId})
      .andWhere('accounts.disabled_at IS NULL')
      .andWhere('accounts.deleted_at IS NULL')
      .getRawOne();
  }

  findByGoogleId(googleId: string): Promise<Accounts> {
    return this.createQueryBuilder('accounts')
      .where('accounts.googleId = :googleId', {googleId})
      .andWhere('accounts.disabled_at IS NULL')
      .andWhere('accounts.deleted_at IS NULL')
      .getOneOrFail();
  }

  searchAccount(payload: AccountsPaginationParams, userId: string) {
    const query = this.createQueryBuilder('account')
      .select('account.id', 'id')
      .addSelect('account.username', 'username')
      .addSelect('account.description', 'description')
      .addSelect('account.fullname', 'fullname')
      .addSelect('account.createdAt', 'createdAt')
      .addSelect('account.updatedAt', 'updatedAt')
      .addSelect('account.email', 'email')
      .addSelect('role.name', 'role')
      .addSelect('a.username', 'createdBy')
      .addSelect('aa.username', 'updatedBy')
      .addSelect('account.disabled_at', 'disabledAt')
      .leftJoin(Accounts, 'a', 'a.id = account.created_by')
      .leftJoin(Accounts, 'aa', 'aa.id = account.updated_by')
      .innerJoin(Roles, 'role', 'role.id = account.role_id')
      .where('account.fullname ILIKE :search', {
        search: `%${payload.search?.trim() || ''}%`,
      })
      .andWhere('account.deleted_at IS NULL')
      .andWhere('account.id != :id', {id: userId})
      .orderBy(payload.sort, payload.dir as 'ASC' | 'DESC');
    if (payload.role && payload.role !== '') {
      query.andWhere('role.name = :role', {
        role: payload.role,
      });
    }
    return paginateRaw<Accounts>(query, {
      limit: payload.limit,
      page: payload.page,
    });
  }

  getAccountsByRoleId(roleId: string) {
    return this.createQueryBuilder(`account`)
      .select('account.id', 'id')
      .addSelect('account.username', 'username')
      .addSelect('account.email', 'email')
      .addSelect('account.phone', 'phone')
      .addSelect('account.fullname', 'fullname')
      .addSelect('account.role_id', 'roleId')
      .addSelect('r.name', 'roleName')
      .innerJoin(Roles, 'r', 'r.id = account.role_id')
      .where(`account.deleted_at IS NULL`)
      .andWhere(`account.disabled_at IS NULL`)
      .andWhere('account.role_id = :role', {role: roleId})

      .getRawMany<Accounts>();
  }

  async getSize(): Promise<number> {
    const result = await this.createQueryBuilder(`accounts`)
      .select(`COUNT(id)`, 'size')
      .andWhere('accounts.disabled_at IS NULL')
      .andWhere('accounts.deleted_at IS NULL')
      .getRawOne<{
        size: number;
      }>();
    return result.size;
  }

  // search(
  //   payload: RepositoryPaginationPayload
  // ): Promise<Pagination<Accounts, IPaginationMeta>> {
  //   const query = this.createQueryBuilder(`accounts`)
  //     .where(`accounts.name LIKE :name`, { name: `%${payload.search}%` })
  //     .orWhere(`accounts.description LIKE :description`, {
  //       description: `%${payload.search}%`,
  //     })
  //     .andWhere('accounts.disabled_at IS NULL')
  //     .andWhere('accounts.deleted_at IS NULL')
  //     .orWhere(`accounts.username = :username`, {
  //       username: `%${payload.search}%`,
  //     })
  //     .orWhere(`accounts.description = :description`, {
  //       description: `%${payload.search}%`,
  //     });
  //   return paginateRaw<Accounts>(query, {
  //     page: payload.page,
  //     limit: payload.limit,
  //   });
  // }

  findIdByKeycloakId(keycloakId: string): Promise<string> {
    return this.createQueryBuilder('accounts')
      .select('accounts.id', 'id')
      .where('accounts.keycloak_id = :keycloakId', {keycloakId: keycloakId})
      .getRawOne()
      .then((data) => (data ? data['id'] : undefined));
  }

  findKeycloakIdByAccountId(id: string): Promise<string> {
    return this.createQueryBuilder('accounts')
      .select('accounts.keycloak_id', 'keycloak_id')
      .where('accounts.id = :id', {id: id})
      .getRawOne()
      .then((data) => (data ? data['keycloak_id'] : undefined));
  }

  async findAvatarURLById(id: string): Promise<string> {
    return this.createQueryBuilder('accounts')
      .select('accounts.avatar', 'avatar')
      .where('accounts.id = :id', {id: id})
      .getRawOne()
      .then((data) => (data ? data['avatar'] : undefined));
  }

  addAvatarURLById(avatarUrl: string, id: string) {
    return this.createQueryBuilder('accounts')
      .update()
      .set({
        avatar: avatarUrl,
      })
      .where('accounts.id = :id', {id: id})
      .useTransaction(true)
      .execute();
  }

  createNewAccount(
    accountId: string,
    keycloakId: string,
    payload: CreateAccountRequestPayload
  ): Promise<InsertResult> {
    return this.createQueryBuilder('a')
      .insert()
      .values({
        username: payload.username,
        email: payload.email,
        createdBy: accountId,
        createdAt: new Date(),
        roleId: payload.roleId,
        description: payload.description,
        fullname: payload.firstName + ' ' + payload.lastName,
        keycloakId: keycloakId,
        phone: payload.phone,
        updatedAt: new Date(),
        updatedBy: accountId,
      })
      .useTransaction(true)
      .execute();
  }

  async updatePartially(
    body: AccountAddRequestPayload,
    accountBeUpdateId: string,
    accountId: string,
    queryRunner: QueryRunner
  ): Promise<Accounts> {
    const oldData = await this.findOneOrFail({
      where: {
        id: accountBeUpdateId,
      },
    });
    return queryRunner.manager.save(Accounts, {
      ...oldData,
      fullname: body.fullname,
      email: body.email,
      phone: body.phone,
      description: body.description,
      updatedBy: accountId,
      roleId: body.roleId,
    });
  }

  updateGoogleIdByEmail(userGoogleId: string, email: string) {
    return this.createQueryBuilder('accounts')
      .update({
        googleId: userGoogleId,
      })
      .where('accounts.email = :email', {email: email})
      .useTransaction(true)
      .execute();
  }

  async disableById(accountId: string, id: string, queryRunner: QueryRunner) {
    const oldData = await this.findOneOrFail({
      where: {
        id: id,
      },
    });
    return await queryRunner.manager.save(Accounts, {
      ...oldData,
      updatedBy: accountId,
      updatedAt: new Date(),
      disabledBy: accountId,
      disabledAt: new Date(),
    });
  }

  findDisabledAccounts(search: string): Promise<Accounts[]> {
    return this.createQueryBuilder('account')
      .select('account.id', 'id')
      .addSelect('account.username', 'username')
      .addSelect('account.fullname', 'fullname')
      .addSelect('account.description', 'description')
      .addSelect('account.role_id', 'roleId')
      .addSelect('account.email', 'email')
      .addSelect('account.phone', 'phone')
      .addSelect('account.disabledAt', 'disabledAt')
      .addSelect('a.username', 'disabledBy')
      .leftJoin(Accounts, 'a', 'a.id = account.disabled_by')
      .andWhere('account.disabled_at IS NOT NULL')
      .andWhere('account.deleted_at IS NULL')
      .andWhere('account.username ILIKE :name', {name: `%${search.trim()}%`})

      .getRawMany<Accounts>();
  }

  async restoreDisabledAccountById(
    accountId: string,
    id: string,
    queryRunner: QueryRunner
  ) {
    const oldData = await this.findOneOrFail({
      where: {
        id: id,
      },
    });
    return await queryRunner.manager.save(Accounts, {
      ...oldData,
      disabledAt: null,
      disabledBy: null,
      updatedBy: accountId,
      updatedAt: new Date(),
    });
  }

  async deleteById(accountId: string, id: string, queryRunner: QueryRunner) {
    const oldData = await this.findOneOrFail({
      where: {
        id: id,
      },
    });
    return await queryRunner.manager.save(Accounts, {
      ...oldData,
      deletedAt: new Date(),
      deletedBy: accountId,
      disabledAt: null,
      disabledBy: null,
    });
  }

  findDeletedAccounts(search: string): Promise<Accounts[]> {
    return (
      this.createQueryBuilder('account')
        .select('account.id', 'id')
        .addSelect('account.username', 'username')
        .addSelect('account.fullname', 'fullname')
        .addSelect('account.description', 'description')
        .addSelect('account.role_id', 'roleId')
        .addSelect('account.email', 'email')
        .addSelect('account.phone', 'phone')
        .addSelect('account.deletedAt', 'deletedAt')
        .addSelect('a.username', 'deletedBy')
        .leftJoin(Accounts, 'a', 'a.id = account.deleted_by')
        .andWhere('account.deleted_at IS NOT NULL')
        .andWhere('account.username ILIKE :name', {
          name: `%${search.trim()}%`,
        })
        // .andWhere('account.deleted_at IS NULL')
        .getRawMany<Accounts>()
    );
  }

  async restoreDeletedAccountById(accountId: string, id: string) {
    const isRestored = await this.createQueryBuilder('accounts')
      .update({
        deletedAt: null,
        deletedBy: null,
        updatedAt: new Date(),
        updatedBy: accountId,
      })
      .where('accounts.id = :id', {id: id})
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

  async findById(id: string): Promise<Accounts> {
    return this.createQueryBuilder('account')
      .select('account.id', 'id')
      .addSelect('account.username', 'username')
      .addSelect('account.description', 'description')
      .addSelect('account.fullname', 'fullname')
      .addSelect('account.createdAt', 'createdAt')
      .addSelect('account.updatedAt', 'updatedAt')
      .addSelect('account.role_id', 'roleId')
      .addSelect('account.email', 'email')
      .addSelect('account.phone', 'phone')
      .addSelect('account.disabled_at', 'disabledAt')
      .addSelect('role.name', 'role')
      .addSelect('a.username', 'createdBy')
      .addSelect('aa.username', 'updatedBy')
      .leftJoin(Accounts, 'a', 'a.id = account.created_by')
      .leftJoin(Accounts, 'aa', 'aa.id = account.updated_by')
      .innerJoin(Roles, 'role', 'role.id = account.role_id')
      .andWhere('account.deleted_at IS NULL')
      .andWhere('account.id = :accountId', {accountId: id})
      .getRawOne<Accounts>();
  }

  findRoleByKeycloakId(keycloakId: string): Promise<string> {
    return this.createQueryBuilder('accounts')
      .select('r.name', 'role')
      .innerJoin(Roles, 'r', 'r.id = accounts.role_id')
      .where('accounts.keycloak_id = :keycloakId', {keycloakId: keycloakId})
      .getRawOne()
      .then((data) => data?.role);
  }

  async findProfileInformationById(keycloakId: string) {
    return this.createQueryBuilder('a')
      .select([
        'a.id',
        'a.username',
        'a.email',
        'a.description',
        'a.phone',
        'a.created_at',
        'a.updated_at',
        'a.fullname',
        'a.avatar',
      ])
      .addSelect('r.name', 'role')
      .innerJoin(Roles, 'r', 'a.role_id = r.id')
      .where('a.keycloak_id = :keycloakId', {keycloakId})
      .andWhere('a.disabled_at IS NULL')
      .andWhere('a.deleted_at IS NULL')
      .getOneOrFail();
  }

  async findUsernameById(id: string): Promise<string> {
    return this.createQueryBuilder('accounts')
      .select('accounts.username', 'username')
      .where('accounts.id = :id', {id})
      .getRawOne()
      .then((data) => data['username']);
  }

  findUsername(): Promise<string[]> {
    return this.createQueryBuilder('accounts')
      .select('accounts.username', 'username')
      .andWhere('accounts.disabled_at IS NULL')
      .andWhere('accounts.deleted_at IS NULL')
      .getRawMany<{ username: string }>()
      .then((data) => data.map((acc) => acc.username));
  }

  async findRoleNameById(id: string): Promise<string> {
    return this.createQueryBuilder('accounts')
      .select('r.name', 'name')
      .innerJoin(Roles, 'r', 'r.id = accounts.role_id')
      .where('accounts.id = :id', {id: id})
      .getRawOne()
      .then((data) => data['name']);
  }

  async findByEmail(email: string): Promise<any> {
    return this.createQueryBuilder('accounts')
      .select('accounts.id', 'id')
      .addSelect('accounts.keycloak_id', 'keycloakId')
      .addSelect('accounts.google_id', 'googleId')
      .addSelect('accounts.username', 'username')
      .addSelect('accounts.email', 'email')
      .addSelect('accounts.fullname', 'fullname')
      .addSelect('accounts.avatar', 'avatar')
      .addSelect('r.name', 'roleName')
      .innerJoin(Roles, 'r', 'r.id = accounts.role_id')
      .where('accounts.email = :email', {email: email})
      .andWhere('accounts.disabled_at IS NULL')
      .andWhere('accounts.disabled_by IS NULL')
      .andWhere('accounts.deleted_at IS NULL')
      .andWhere('accounts.deleted_by IS NULL')
      .getRawOne();
  }
}
