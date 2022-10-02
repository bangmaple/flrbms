import {BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger,} from '@nestjs/common';
import {Accounts} from '../models';
import {AccountRepository} from '../repositories';
import {KeycloakService} from './keycloak.service';
import {CloudinaryService} from './cloudinary.service';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {ChangeProfilePasswordRequest} from '../payload/request/change-password.request.payload';
import {randomUUID} from 'crypto';
import {AccountsPaginationParams} from '../dto/accounts-pagination.dto';
import {AccountHistService} from './account-hist.service';
import {AccountAddRequestPayload} from '../payload/request/account-add.request.payload';
import {AccountUpdateProfilePayload} from '../payload/request/account-update-profile.request.payload';
import {Role} from '../enum/roles.enum';
import {DataSource} from 'typeorm';
import {BookingRoomService} from './booking-room.service';
import {CreateAccountRequestPayload} from '../payload/request/create-account-request-payload.dto';
import {RoleService} from './role.service';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly cloudinaryService: CloudinaryService,
    private readonly repository: AccountRepository,
    private readonly histService: AccountHistService,

    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,

    private readonly keycloakService: KeycloakService,

    @Inject(forwardRef(() => BookingRoomService))
    private readonly bookingRoomService: BookingRoomService
  ) {
  }

  async isDeletedByUsername(id: string): Promise<boolean> {
    return await this.repository.isDeletedByUsername(id);
  }

  async isDisabledByUsername(id: string): Promise<boolean> {
    return await this.repository.isDisabledByUsername(id);
  }

  async getAll(request: AccountsPaginationParams, userId: string) {
    try {
      const result = await this.repository.searchAccount(request, userId);
      if (
        result.meta.totalPages > 0 &&
        result.meta.currentPage > result.meta.totalPages
      ) {
        throw new BadRequestException('Current page is over');
      }

      return result;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message || 'One or more parameters is invalid'
      );
    }
  }

  async getUserNames() {
    try {
      return await this.repository.findUserNames();
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getRoleOfAccount(id: string) {
    try {
      const role = await this.repository.getRoleOfAccount(id);
      return role;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('One or more parameters is invalid');
    }
  }

  async getById(id: string): Promise<Accounts> {
    try {
      const account = await this.repository.findById(id);
      return account;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('Account does not exist');
    }
  }

  getUserIdByKeycloakId(keycloakId: string): Promise<string> {
    return this.repository.findIdByKeycloakId(keycloakId);
  }

  async findByKeycloakId(keycloakId: string): Promise<Accounts> {
    try {
      const a = await this.repository.findByKeycloakId(keycloakId);
      return a;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getAccountsByRoleId(roleId: string): Promise<Accounts[]> {
    try {
      return await this.repository.getAccountsByRoleId(roleId);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        'An error occurred while getting accounts by type ' + roleId
      );
    }
  }

  async updateById(
    accountId: string,
    id: string,
    body: AccountAddRequestPayload
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (accountId === id) {
        throw new BadRequestException('Cannot update your own account');
      }
      const accountBeUpdated = await this.repository.getRoleOfAccount(id);

      if (accountBeUpdated.role_name === Role.APP_ADMIN) {
        throw new BadRequestException("Can't update admin");
      }

      const data = await this.repository.findById(id);
      if (data === undefined) {
        throw new BadRequestException(
          'This account is already deleted or disabled'
        );
      }

      const accountUpdated = await this.repository.updatePartially(
        body,
        id,
        accountId,
        queryRunner
      );

      await this.histService.createNew(accountUpdated, queryRunner);
      await queryRunner.commitTransaction();
      return accountUpdated;
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        e.message ?? 'Error occurred while updating this account'
      );
    } finally {
      await queryRunner.release()
    }
  }

  async disableById(accountId: string, id: string): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (accountId === id) {
        throw new BadRequestException('Cannot disable your own account');
      }
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Account does not found with the provided id'
        );
      }
      const isDisabled = await this.repository.checkIfAccountIsDisabledById(id);
      if (isDisabled) {
        throw new BadRequestException('This account is already disabled');
      }
      const isDeleted = await this.repository.checkIfAccountIsDeletedById(id);
      if (isDeleted) {
        throw new BadRequestException(
          'This account is already deleted, can not disable'
        );
      }

      const account = await this.repository.getRoleOfAccount(id);
      if (account.role_name === 'System Admin') {
        throw new BadRequestException("You can't disable the system admin");
      }

      const listRequestOfAccount =
        await this.bookingRoomService.getRequestBookingByAccountId(id);
      if (listRequestOfAccount.length > 0) {
        const reason = 'This account was disabled, request was be cancelled';
        listRequestOfAccount.forEach(async (request) => {
          await this.bookingRoomService.cancelRequest(
            accountId,
            request.id,
            reason,
            queryRunner
          );
        });
      }

      const accountDisabled = await this.repository.disableById(
        accountId,
        id,
        queryRunner
      );
      await this.histService.createNew(accountDisabled, queryRunner);

      await queryRunner.commitTransaction();
      return accountDisabled;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        e.message ?? 'Error occurred while disable this account'
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getDisabledAccounts(search: string): Promise<Accounts[]> {
    try {
      return await this.repository.findDisabledAccounts(search);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException('Error while getting disabled accounts');
    }
  }

  async handleRestoreDisabledAccountById(accountId: string, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Account does not found with the provided id'
        );
      }
      const isDeleted = await this.repository.checkIfAccountIsDeletedById(id);
      if (isDeleted) {
        throw new BadRequestException('This account is already deleted');
      }
      const isDisabled = await this.repository.checkIfAccountIsDisabledById(id);
      if (!isDisabled) {
        throw new BadRequestException(
          'This account ID is now active. Cannot restore it'
        );
      }
      const account = await this.repository.restoreDisabledAccountById(
        accountId,
        id,
        queryRunner
      );
      await this.histService.createNew(account, queryRunner);
      await queryRunner.commitTransaction();
      return account;
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        e.message ??
        'Error occurred while restore the disabled status of this account'
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteById(accountId: string, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (accountId === id) {
        throw new BadRequestException('Cannot delete your own account');
      }

      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Account does not found with the provided id'
        );
      }

      const userDelete = await this.repository.getRoleOfAccount(accountId);
      const userBeDeleted = await this.repository.getRoleOfAccount(id);

      if (userBeDeleted) {
        if (userBeDeleted?.role_name === Role.APP_ADMIN) {
          throw new BadRequestException("Can't delete admin");
        }
      } else {
        throw new BadRequestException('This account was deleted');
      }

      if (userDelete?.role_name === userBeDeleted?.role_name) {
        throw new BadRequestException(
          "You can't delete user have same role with you"
        );
      }
      const isDeleted = await this.repository.checkIfAccountIsDeletedById(id);
      if (isDeleted) {
        throw new BadRequestException('This account is already deleted');
      }

      const listRequestOfAccount =
        await this.bookingRoomService.getRequestBookingByAccountId(id);
      if (listRequestOfAccount.length > 0) {
        const reason = 'This account was deleted, request was be cancelled';
        listRequestOfAccount.forEach(async (request) => {
          await this.bookingRoomService.cancelRequest(
            accountId,
            request.id,
            reason,
            queryRunner
          );
        });
      }

      const account = await this.repository.deleteById(
        accountId,
        id,
        queryRunner
      );
      await this.histService.createNew(account, queryRunner);
      await queryRunner.commitTransaction();
      return account;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getDeletedAccounts(search: string): Promise<Accounts[]> {
    try {
      return await this.repository.findDeletedAccounts(search);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException('Error while getting deleted accounts');
    }
  }

  async handleRestoreDeletedAccountById(accountId: string, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Account does not found with the provided id'
        );
      }
      const isDisabled = await this.repository.checkIfAccountIsDisabledById(id);
      if (isDisabled) {
        throw new BadRequestException('This account is already disabled');
      }
      const isDeleted = await this.repository.checkIfAccountIsDeletedById(id);
      if (!isDeleted) {
        throw new BadRequestException(
          'This account ID is now active. Cannot restore it'
        );
      }

      const account = await this.repository.restoreDeletedAccountById(
        accountId,
        id
      );
      await this.histService.createNew(account, queryRunner);
      await queryRunner.commitTransaction();
      return account;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  syncUsersFromKeycloak(): Promise<any> {
    return Promise.resolve();
  }

  async uploadAvatarByAccountId(
    image: Express.Multer.File,
    id: string
  ): Promise<void> {
    try {
      const isDisabled = await this.repository.checkIfAccountIsDisabledById(id);
      const isDeleted = await this.repository.checkIfAccountIsDeletedById(id);
      if (isDisabled || isDeleted) {
        throw new BadRequestException(
          'This account has been disabled or deleted'
        );
      }

      const imageId = randomUUID();
      await this.cloudinaryService.uploadImageAndGetURL(image.buffer, imageId);
      const url = await this.cloudinaryService.getImageURLByFileName(imageId);
      await this.repository.addAvatarURLById(url, id);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(
        e.message ?? 'Error while uploading avatar'
      );
    }
  }

  getAccountByKeycloakId(id: string) {
    return this.repository
      .findOneOrFail({
        where: {
          keycloakId: id,
        },
      })
      .catch((e) => {
        this.logger.error(e.message);
        throw new BadRequestException('Error while retrieving account');
      });
  }

  async getAccountRoleByKeycloakId(keycloakId: string): Promise<string> {
    try {
      return await this.repository.findRoleByKeycloakId(keycloakId);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async changePassword(
    keycloakUser: KeycloakUserInstance,
    payload: ChangeProfilePasswordRequest
  ): Promise<void> {
    try {
      if (payload.password === payload.newPassword) {
        throw new BadRequestException(
          'Old password must not be the same with new password.'
        );
      }
      await this.keycloakService.signInToKeycloak(
        payload.username,
        payload.password
      );
      await this.keycloakService.changePasswordByKeycloakId(
        keycloakUser.sub,
        payload.newPassword
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(
        e.message ?? 'Error while changing account password'
      );
    }
  }

  // async getUsernameByAccountId(id: string): Promise<string> {
  //   try {
  //     return await this.repository.findUsernameById(id);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  async saveFCMToken(
    keycloakUser: KeycloakUserInstance,
    body: { fcmToken: string }
  ): Promise<Accounts> {
    try {
      const user = await this.repository.findByKeycloakId(keycloakUser.sub);
      if (!user) {
        throw new BadRequestException(
          'Account does not exist with the provided id'
        );
      }

      return await this.repository.save({
        ...user,
        ...body,
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException('Error while save fcm token.');
    }
  }

  async removeFCMToken(keycloakUser: KeycloakUserInstance): Promise<Accounts> {
    try {
      const user = await this.repository.findByKeycloakId(keycloakUser.sub);
      if (!user) {
        throw new BadRequestException(
          'Account does not exist with the provided id'
        );
      }

      return await this.repository.save({
        ...user,
        fcmToken: null,
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException('Error while remove fcm token.');
    }
  }

  async updateMyProfile(
    keycloakUser: KeycloakUserInstance,
    body: AccountUpdateProfilePayload
  ): Promise<Accounts> {
    try {
      const user = await this.repository.findByKeycloakId(keycloakUser.sub);
      if (!user) {
        throw new BadRequestException(
          'Account does not exist with the provided id'
        );
      }

      return await this.repository.save({
        ...user,
        ...body,
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException('Error while update your profile.');
    }
  }

  async changePasswordByKeycloakId(id: string, password: string) {
    try {
      const keycloakId = await this.repository.findKeycloakIdByAccountId(id);
      await this.keycloakService.changePasswordByKeycloakId(
        keycloakId,
        password
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(
        'Error while changing password by keycloak id'
      );
    }
  }

  async getAvatarURLByAccountId(accountId: string): Promise<string> {
    return await this.repository.findAvatarURLById(accountId);
  }

  async getCurrentProfileInformation(keycloakId: string): Promise<Accounts> {
    try {
      return await this.repository.findProfileInformationById(keycloakId);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  getUsernameList(): Promise<string[]> {
    return this.repository.findUsername();
  }

  async getKeycloakIdByGoogleId(googleId: string): Promise<string> {
    try {
      return await this.repository.findKeycloakIdByGoogleId(googleId);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getAccountByGoogleId(googleId: string): Promise<Accounts> {
    try {
      return await this.repository.findByGoogleId(googleId);
    } catch (e) {
      this.logger.error(e.emssage);
      throw new BadRequestException(e.message);
    }
  }

  async checkIfAccountAlreadyHasAvatarImage(
    accountId: string
  ): Promise<boolean> {
    try {
      const isExisted = this.repository.existsById(accountId);
      if (!isExisted) {
        throw new BadRequestException(
          'Account does not exists with the provided id'
        );
      }
      return await this.repository.checkIfUserAlreadyHasAvatar(accountId);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async addGoogleAvatarURLByAccountId(
    googleImageURL: string,
    accountId: string
  ): Promise<void> {
    try {
      const result = await this.repository.addAvatarURLById(
        googleImageURL,
        accountId
      );
      if (result.affected < 1) {
        throw new BadRequestException(
          'Error while updating account google image'
        );
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async updateGoogleIdByAccountEmail(
    googleId: string,
    email: string
  ): Promise<void> {
    try {
      const result = await this.repository.updateGoogleIdByEmail(
        googleId,
        email
      );
      if (result.affected < 1) {
        throw new HttpException(
          'Invalid account. Please contract to administrator for more information',
          HttpStatus.UNAUTHORIZED
        );
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getAccountIdByKeycloakId(keycloakId: string) {
    return this.repository.findIdByKeycloakId(keycloakId);
  }

  async getAccountRoleById(id: string) {
    try {
      return await this.repository.findRoleNameById(id);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }

  async createNewAccount(
    accountId: string,
    account: CreateAccountRequestPayload
  ) {
    let keycloakUserCreated = false;
    try {
      if (account.password !== account.confirmPassword) {
        throw new BadRequestException(
          'Password does not match. Please try again.'
        );
      }
      const isExitByUsername = await this.repository.existsByUsername(
        account.username
      );
      if (isExitByUsername) {
        throw new BadRequestException('Username is already in use');
      }

      const isExitByMail = await this.repository.existsByEmail(account.email);
      if (isExitByMail) {
        throw new BadRequestException('This email is already in use');
      }

      const isExitByPhone = await this.repository.existsByPhone(account.phone);
      if (isExitByPhone) {
        throw new BadRequestException('This phone number is already in use');
      }

      const role = await this.roleService.getRoleById(account.roleId);
      const roleGroup = role.name === 'System Admin' ? 'admin' : 'librarian';

      await this.keycloakService.createKeycloakUser({
        username: account.username,
        password: account.password,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        roleGroup,
      });
      keycloakUserCreated = true;

      const user = await this.keycloakService.getUserByUsername(
        account.username
      );
      await this.repository.createNewAccount(accountId, user.id, account);
    } catch (e) {
      this.logger.error(e.message);
      if (keycloakUserCreated) {
        await this.keycloakService.removeKeycloakUserByKeycloakUsername();
      }
      throw new BadRequestException(e.message);
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.repository.findByEmail(email);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async createNewAccountWithoutKeycloak(param: {
    password: string;
    role: string;
    fullname: string;
    email: string;
    username: string;
  }) {
    try {
      const role = await this.roleService.findByName('Staff');
      const accountId = randomUUID();
      return await this.createNewAccount(accountId, {
        email: param.email,
        password: param.password,
        confirmPassword: param.password,
        username: param.username,
        phone: '',
        description: '',
        firstName: param.fullname,
        lastName: param.fullname,
        roleId: role.id,
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }
}
