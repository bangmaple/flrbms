import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query,} from '@nestjs/common';
import {Pagination} from 'nestjs-typeorm-paginate';
import {DeviceType} from '../models';
import {DeviceTypeService} from '../services/device-type.service';
import {Roles, User} from '../decorators';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {Role} from '../enum';
import {ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {PaginationParams} from '../dto/pagination.dto';
import {MasterDataAddRequestPayload} from '../payload/request/master-data-add.request.payload';

@Controller('/v1/device-type')
@ApiBearerAuth()
@ApiTags('Device Types')
export class DeviceTypeController {
  constructor(private readonly service: DeviceTypeService) {
  }

  @Get()
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got get all device types',
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
  @ApiOperation({
    summary: 'Get all device types',
    description: 'Get all device types',
  })
  getAllDeviceTypes(
    @Query() payload: PaginationParams
  ): Promise<Pagination<DeviceType>> {
    return this.service.getAllDeviceTypes(payload as PaginationParams);
  }

  @Get('name')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got device type name',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for roles is not validated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiOperation({
    summary: 'Get all device type name',
    description: 'Get all device type name',
  })
  getDeviceTypeNames() {
    return this.service.getDeviceTypeNames();
  }

  @Get(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched device type by id',
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
  @ApiOperation({
    summary: 'Get device type by id',
    description: 'Get device type by id',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of active device type",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  getDeviceTypeById(@Param('id') id: string): Promise<DeviceType> {
    return this.service.getDeviceTypeById(id);
  }

  @Post()
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add a new device type',
    description: 'Add a new device type',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully added device type',
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
  addNewDeviceType(
    @User() user: KeycloakUserInstance,
    @Body() payload: MasterDataAddRequestPayload
  ) {
    return this.service.addNewDeviceType(user.account_id, payload);
  }

  @Put(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated device type by id',
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
  @ApiOperation({
    summary: 'Update device type by id',
    description: 'Update device type by id',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of active device type",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  updateDeviceTypeById(
    @Param('id') id: string,
    @Body() payload: MasterDataAddRequestPayload,
    @User() user: KeycloakUserInstance
  ) {
    return this.service.updateDeviceTypeById(user.account_id, id, payload);
  }

  @Delete(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted device types',
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
  @ApiOperation({
    summary: 'Deleted device types',
    description: 'Deleted device types',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of active device type",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  deleteDeviceTypeById(
    @Param('id') id: string,
    @User() user: KeycloakUserInstance
  ) {
    return this.service.deleteDeviceTypeById(user.account_id, id);
  }

  @Get('deleted')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted device types',
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
  @ApiOperation({
    summary: 'Get deleted device types',
    description: 'Get deleted device types',
  })
  @ApiParam({
    name: 'search',
    description: "Search deleted device types",
    type: String,
    required: false,
    example: 'Can borrow a lot',
  })
  getDeletedDeviceTypes(@Query('search') search: string) {
    return this.service.getDeletedDeviceTypes(search);
  }


  @Put('restore-deleted/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully restored deleted device by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for deleted device type is not validated',
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
    summary: 'Successfully restored deleted device type by id',
    description: 'Successfully restored deleted device type by id',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of deleted device type",
    type: String,
    required: true,
    example: 'ABCD1234-123',
  })
  restoreDeletedTypeById(
    @Param('id') id: string,
    @User() keycloakUser: KeycloakUserInstance
  ) {
    return this.service.restoreDeletedDeviceTypeById(keycloakUser.account_id, id);
  }

  @Delete('permanent/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully permanent deleted device type by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Request params for permanent delete device type is not validated',
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
    summary: 'Permanently delete device type by id',
    description: 'Permanently delete device type by id',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of deleted device type",
    type: String,
    required: true,
    example: 'Can borrow a lot',
  })
  permanentlyDeleteDeviceTypeById(@Param('id') id: string) {
    return this.service.permanentlyDeleteDeviceTypeById(id);
  }
}
