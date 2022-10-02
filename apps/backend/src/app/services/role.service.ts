import {BadRequestException, forwardRef, Inject, Injectable, Logger,} from '@nestjs/common';
import {PaginationParams} from '../dto/pagination.dto';
import {RolesRepository} from '../repositories/roles.repository';
import {MasterDataAddRequestPayload} from '../payload/request/master-data-add.request.payload';
import {Roles} from '../models';
import {RoleHistService} from './role-hist.service';
import {AccountsService} from './accounts.service';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @Inject(forwardRef(() => AccountsService))
    private readonly accountService: AccountsService,
    private readonly repository: RolesRepository,
    private readonly histService: RoleHistService
  ) {
  }

  async getRolesByPagination(payload: PaginationParams) {
    try {
      const result = await this.repository.findByPagination(payload);
      if (
        result.meta.totalPages > 0 &&
        result.meta.currentPage > result.meta.totalPages
      ) {
        throw new BadRequestException('Current page is over');
      }
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }

  getRoleNames() {
    try {
      return this.repository.findRoleName();
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getRoleById(id: string) {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Role does not found with the provided id'
        );
      }
      const data = await this.repository.findById(id);
      if (data === undefined) {
        throw new BadRequestException('This role is already deleted');
      }
      return data;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async addRole(body: MasterDataAddRequestPayload, accountId: string) {
    const isExisted = await this.repository.isExistedByName(body.name);
    if (isExisted) {
      throw new BadRequestException('Role name is duplicated!');
    } else {
      const role = await this.repository.addNew(accountId, body);
      await this.histService.createNew(role);
      return role;
    }
  }

  async updateRoleById(
    accountId: string,
    payload: MasterDataAddRequestPayload,
    id: string
  ) {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Role does not found with the provided id'
        );
      }
      const data = await this.repository.findById(id);
      if (data === undefined) {
        throw new BadRequestException(
          'This role is already deleted or disabled'
        );
      }
      const role = await this.repository.updateById(id, accountId, payload);
      await this.histService.createNew(role);
      return role;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async deleteRoleById(accountId: string, id: string) {
    try {
      const data = await this.repository.findById(id);
      const listAccountOfThisRole =
        await this.accountService.getAccountsByRoleId(id);
      if (data === undefined) {
        throw new BadRequestException('This role is already deleted');
      } else if (
        listAccountOfThisRole !== undefined &&
        listAccountOfThisRole.length > 0
      ) {
        throw new BadRequestException(
          'There are still account of this type, please change the type of those accounts before deleting role'
        );
      } else {
        const role = await this.repository.deleteById(accountId, id);
        await this.histService.createNew(role);
        return role;
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getDeletedRoles(search: string): Promise<Roles[]> {
    try {
      return await this.repository.getDeletedRoles(search);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException('Error while delete this role');
    }
  }

  async handleRestoreDeletedRoleById(accountId: string, id: string) {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Role does not exist with the provided id'
        );
      }
      const data = await this.repository.findById(id);
      if (data !== undefined) {
        throw new BadRequestException(
          'This Role ID is now active. Cannot restore it'
        );
      }
      const role = await this.repository.restoreDeletedById(accountId, id);
      await this.histService.createNew(role);
      return role;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ??
        'Error occurred while restore the delete status of this role'
      );
    }
  }

  async permanentDeleteRoleById(id: string) {
    try {
      const data = await this.repository.findById(id);
      if (data !== undefined) {
        throw new BadRequestException(
          'Please delete this role after permanently delete'
        );
      } else {
        await this.histService.deleteAllHist(id);
        return this.repository.permanentlyDeleteById(id);
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async findByName(name: string) {
    try {
      return this.repository.findByName(name);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async findNameByAccountId(accountId: string) {
    try {
      return this.repository.findNameByAccountId(accountId);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }
}
