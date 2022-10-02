import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {AccountsService} from '../services';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {Roles, User} from '../decorators';
import {FastifyFileInterceptor, PathLoggerInterceptor} from '../interceptors';
import {Role} from '../enum';
import {Accounts} from '../models';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {ChangeProfilePasswordRequest} from '../payload/request/change-password.request.payload';
import {AccountsPaginationParams} from '../dto/accounts-pagination.dto';
import {AccountAddRequestPayload} from '../payload/request/account-add.request.payload';
import {AccountUpdateProfilePayload} from '../payload/request/account-update-profile.request.payload';
import {CreateAccountRequestPayload} from '../payload/request/create-account-request-payload.dto';

@Controller('v1/accounts')
@ApiBearerAuth()
@ApiTags('Accounts')
@UseInterceptors(new PathLoggerInterceptor(AccountsController.name))
export class AccountsController {
  constructor(private readonly service: AccountsService) {
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get the list of accounts by pagination',
    description:
      'Get the list of accounts with the provided pagination payload',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the users list',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while getting users or request payload is invalid',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  getAll(
    @Query() payload: AccountsPaginationParams,
    @User() user: KeycloakUserInstance
  ) {
    return this.service.getAll(payload, user.account_id);
  }

  @Get('name')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully get user name',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for roles is not validated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiOperation({
    summary: 'Get user name',
    description: 'Get user name',
  })
  getUserNames() {
    return this.service.getUserNames();
  }

  @Get('syncKeycloak')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Sync users from Keycloak to current DB',
    description: 'Sync users from Keycloak to current DB',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully synchronized users from Keycloak to current DB',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while synchronizing users from Keycloak to current DB',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  syncUsersFromKeycloak() {
    return this.service.syncUsersFromKeycloak();
  }

  @Get('find/:id')
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Retrieve account information by id',
    description: 'Get account information by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the account information',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving account information by id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of active account',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  getAccountById(@Param() payload: { id: string }) {
    return this.service.getById(payload.id);
  }

  @Get('my-profile')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Retrieve current profile information',
    description: 'Get profile information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the profile information',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving profile information',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  getCurrentProfileInformation(
    @User() user: KeycloakUserInstance
  ): Promise<Accounts> {
    return this.service.getCurrentProfileInformation(user.sub);
  }

  @Get('avatar')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Get avatar URL by keycloak id',
    description: 'Get avatar URL by keycloak id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved own avatar account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving own avatar account',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of keycloak ',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  getMyAvatarURL(@User() keycloakUser: KeycloakUserInstance) {
    return this.service.getAvatarURLByAccountId(keycloakUser.account_id);
  }

  @Post()
  @Roles(Role.APP_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create new account by system admin role',
    description: 'Create new account as librarian or system admin account',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully created new account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while creating new account',
  })
  createNewAccount(
    @User() keycloakUser: KeycloakUserInstance,
    @Body() account: CreateAccountRequestPayload
  ) {
    return this.service.createNewAccount(keycloakUser.account_id, account);
  }

  @Get('find-by-keycloak-id/:id')
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get account information by keycloak id',
    description: 'Get account information by keycloak id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieve account information',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving account information by keycloak id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of Keycloak account',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  getAccountByKeycloakId(@Param() payload: { id: string }) {
    return this.service.getAccountByKeycloakId(payload.id);
  }

  @Get('by-role')
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get active accounts by role',
    description: 'Use role_id to get account based on each of roles',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'One or more payload parameters are invalid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched accounts',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of role',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  getAccountsByRoleId(@Query('role') roleId = ''): Promise<Accounts[]> {
    return this.service.getAccountsByRoleId(roleId);
  }

  @Put('update/:id')
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Update account by ID',
    description: 'Update account by provided ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated account by ID',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while updating account by ID',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of active account to update',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  updateAccountById(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string },
    @Body() body: AccountAddRequestPayload
  ) {
    return this.service.updateById(user.account_id, payload.id, body);
  }

  @Put('save-fcmtoken')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Save FCM Token',
    description: 'Save FCM Token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully save FCM Token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while saving FCM Token',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  saveFCMToken(
    @User() user: KeycloakUserInstance,
    @Body() body: { fcmToken: string }
  ) {
    return this.service.saveFCMToken(user, body);
  }

  @Put('update-profile')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Update own profile',
    description: 'Update own profile based on provided credentials',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated own profile',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while updating own profile',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  updateMyProfile(
    @User() user: KeycloakUserInstance,
    @Body() body: AccountUpdateProfilePayload
  ) {
    return this.service.updateMyProfile(user, body);
  }

  @Put('disable/:id')
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Disable account by id',
    description: 'Disable account by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully disabled the account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while disabling the account',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of active account',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  disableAccountById(
    @User() user: KeycloakUserInstance,
    @Param('id') id: string
  ) {
    return this.service.disableById(user.account_id, id);
  }

  @Get('disabled')
  @ApiOperation({
    summary: 'Get a list of disabled accounts',
    description: 'Get a list of disabled accounts',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiParam({
    name: 'search',
    description: 'Search disabled accounts',
    type: String,
    required: false,
    example: 'Staff',
  })
  getDisabledAccounts(@Query('search') search = '') {
    return this.service.getDisabledAccounts(search);
  }

  @Put('restore-disabled/:id')
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Restore the disabled account by id',
    description: 'Restore the disabled account by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully restored the disabled account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while restoring the disabled the account',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of disabled account',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  restoreDisabledAccountById(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string }
  ) {
    return this.service.handleRestoreDisabledAccountById(
      user.account_id,
      payload.id
    );
  }

  @Delete(':id')
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Delete the account by id',
    description: 'Delete the account by active or disabled account ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while delete the account',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of active or disabled account',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  deleteAccountById(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string }
  ) {
    return this.service.deleteById(user.account_id, payload.id);
  }

  @Get('deleted')
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get the list of deleted accounts',
    description: 'Get the list of deleted accounts',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched deleted accounts',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving deleted account',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  @ApiParam({
    name: 'search',
    description: 'Search deleted accounts',
    type: String,
    required: false,
    example: 'Staff',
  })
  getDeletedAccounts(@Query('search') search = '') {
    return this.service.getDeletedAccounts(search);
  }

  @Put('restore-deleted/:id')
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Successfully restored deleted account by id',
    description: 'Successfully restored deleted account by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully restored deleted account by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for deleted deleted account is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of deleted account',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  restoreDeletedUserById(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string }
  ) {
    return this.service.handleRestoreDeletedAccountById(
      user.account_id,
      payload.id
    );
  }

  @Put('update/upload-avatar/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FastifyFileInterceptor('file', {}))
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Update account avatar by account id',
    description: 'Update account avatar by account id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated avatar account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while updating avatar for account',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of active account',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: {type: 'string'},
        outletId: {type: 'integer'},
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  updateAccountUploadAvatarById(
    @User() user: KeycloakUserInstance,
    @UploadedFile() image: Express.Multer.File,
    @Param() payload: { id: string }
  ) {
    return this.service.uploadAvatarByAccountId(image, payload.id);
  }

  @Put('update/upload-avatar/profile')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FastifyFileInterceptor('file', {}))
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Update profile avatar',
    description: 'Update profile avatar',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated profile account',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while updating avatar for account',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: {type: 'string'},
        outletId: {type: 'integer'},
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  updateCurrentProfileAvatar(
    @User() user: KeycloakUserInstance,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.service.uploadAvatarByAccountId(image, user.account_id);
  }

  @Put('update/change-password')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Change password by current profile',
    description: 'Change password by current profile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully changed password',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while changing password for account',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  changePassword(
    @User() keycloakUser: KeycloakUserInstance,
    @Body() payload: ChangeProfilePasswordRequest
  ) {
    return this.service.changePassword(keycloakUser, payload);
  }

  @Put('update/change-password/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Change password by keycloak ID',
    description: 'Change password by keycloak ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully changed password by keycloak ID',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while changing password by keycloak ID',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of keycloak ID',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  changePasswordByKeycloakId(
    @Param() payload: { id: string },
    @Body() requestPayload: ChangeProfilePasswordRequest
  ) {
    return this.service.changePasswordByKeycloakId(
      payload.id,
      requestPayload.password
    );
  }
}
