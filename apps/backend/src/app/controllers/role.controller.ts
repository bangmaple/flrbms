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
  UseInterceptors,
} from '@nestjs/common';
import {PaginationParams} from '../dto/pagination.dto';
import {Roles, User} from '../decorators';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {RoleService} from '../services/role.service';
import {ApiBearerAuth, ApiOperation, ApiParam, ApiProduces, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {PathLoggerInterceptor} from '../interceptors';
import {Role} from '../enum';
import {MasterDataAddRequestPayload} from '../payload/request/master-data-add.request.payload';

@Controller('/v1/roles')
@ApiBearerAuth()
@ApiTags('Roles')
@UseInterceptors(new PathLoggerInterceptor(RoleController.name))
export class RoleController {
  constructor(private readonly service: RoleService) {
  }

  @Get()
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get roles by pagination',
    description: 'Get roles by pagination',
  })
  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched roles by pagination',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for roles is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getRolesByPagination(@Query() payload: PaginationParams) {
    return this.service.getRolesByPagination(payload);
  }

  @Get('name')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully get role name',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
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
    summary: 'Get role name',
    description: 'Get role name',
  })
  getRoleNames() {
    return this.service.getRoleNames();
  }

  @Get(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get role by ID',
    description: 'Get role by ID',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Id for role is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched role by id',
  })
  getRoleById(@Param('id') id: string) {
    return this.service.getRoleById(id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request payload for role is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully added role',
  })
  @ApiOperation({
    summary: 'Add a new role',
    description: 'Add a new role',
  })
  addRole(
    @Body() body: MasterDataAddRequestPayload,
    @User() user: KeycloakUserInstance
  ) {
    return this.service.addRole(body, user.account_id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update role by ID',
    description: 'Update role by ID',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request payload for role is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated role with provided id',
  })
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  updateRoleById(
    @Body() body: MasterDataAddRequestPayload,
    @User() user: KeycloakUserInstance,
    @Param('id') id: string
  ) {
    return this.service.updateRoleById(user.account_id, body, id);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully removed role with provided ID',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID for role is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiOperation({
    summary: 'Delete role by id',
    description: 'Delete role by id',
  })
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  deleteRoleById(
    @User() keycloakUser: KeycloakUserInstance,
    @Param('id') id: string
  ) {
    return this.service.deleteRoleById(keycloakUser.account_id, id);
  }

  @Get('deleted')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Retrieving a list of deleted role',
    description: 'Retrieving a list of deleted role',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieving a list of deleted role',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving a list of deleted role',
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
    name: 'search',
    description: "Search deleted roles",
    type: String,
    required: false,
    example: 'Staff',
  })
  getDeletedRoles(@Query('search') search: string) {
    return this.service.getDeletedRoles(search);
  }

  @Put('restore-deleted/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Restore the deleted role by ID',
    description: 'Restore the deleted role by provided ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully restored the deleted role',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while restoring the deleted the role',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  restoreDeletedRoleById(
    @Param('id') id: string,
    @User() keycloakUser: KeycloakUserInstance
  ) {
    return this.service.handleRestoreDeletedRoleById(
      keycloakUser.account_id,
      id
    );
  }

  @Delete('permanent/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully permanent deleted role by ID',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for permanent delete role is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiOperation({
    summary: 'Permanently delete role by ID',
    description: 'Permanently delete role by ID',
  })
  permanentDeleteRoleById(@Param('id') id: string) {
    return this.service.permanentDeleteRoleById(id);
  }
}
