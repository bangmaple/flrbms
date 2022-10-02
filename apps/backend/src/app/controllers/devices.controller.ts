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
  UsePipes,
} from '@nestjs/common';
import {DevicesService} from '../services';
import {ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {DevicesValidation} from '../pipes';
import {PathLoggerInterceptor} from '../interceptors';
import {Roles, User} from '../decorators';
import {Role} from '../enum';
import {Devices} from '../models';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {DevicesPaginationParams} from '../dto/devices-pagination.dto';
import {DataAddRequestPayload} from '../payload/request/data-add.request.payload';

@Controller('/v1/devices')
@ApiBearerAuth()
@ApiTags('Devices')
@UseInterceptors(new PathLoggerInterceptor(DevicesController.name))
export class DevicesController {
  constructor(private readonly service: DevicesService) {
  }

  @Get()
  @UsePipes(new DevicesValidation())
  @HttpCode(HttpStatus.OK)
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get all devices',
    description: 'Get the list of active devices',
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
    description: 'Successfully fetched devices',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges to access this endpoint',
  })
  getDevices(@Query() payload: DevicesPaginationParams) {
    return this.service.getAll(payload);
  }

  @Get('name')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Get names of devices',
    description: 'Get the list of names of devices',
  })
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
  getDeviceNames(@Query('search') search: string, @Query('dir') dir: string) {
    return this.service.getDeviceNames(search, dir);
  }

  @Get('by-device-type')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get devices by device type ID',
    description: 'Get the list of devices by device type ID',
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
    description: 'Successfully fetched devices by device type',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiParam({
    name: 'deviceTypeID',
    description: 'Device type ID',
    type: String,
    required: false,
    example: 'abcdef1234',
  })
  getDevicesByDeviceType(@Query('type') deviceTypeId = ''): Promise<Devices[]> {
    return this.service.getDevicesByDeviceType(deviceTypeId);
  }

  @Get('find/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Retrieving device by id',
    description: 'Retrieving device by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieving device by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving device by id',
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
    description: 'The ID of active device',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  getDeviceById(@Param() payload: { id: string }): Promise<Devices> {
    return this.service.findById(payload.id);
  }

  @Post('add')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Create a new device',
    description: 'Create new device with the provided payload',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created a new device',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request payload for device is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  createNewDevice(
    @User() user: KeycloakUserInstance,
    @Body() device: DataAddRequestPayload
  ) {
    return this.service.add(device, user.account_id);
  }

  @Put('update/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Update the device by id',
    description: 'Update the device by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated the device',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while updating the device',
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
    description: 'The ID of active device',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  updateDeviceById(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string },
    @Body() body: DataAddRequestPayload
  ) {
    return this.service.updateById(user.account_id, payload.id, body);
  }

  @Put('update-type-then-restore/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Update library device by id',
    description: 'Update library device by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated the library device',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while updating the library device',
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
    description: "The ID of active device",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  updateTypeThenRestore(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string },
    @Body() body: { type: string }
  ) {
    return this.service.updateTypeThenRestore(user.account_id, payload.id, body);
  }

  @Put('disable/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Disable the device by id',
    description: 'Disable the device by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully disabled the device',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while disabling the device',
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
    description: 'The ID of active device',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  disableDeviceById(
    @User() user: KeycloakUserInstance,
    @Param('id') id: string
  ) {
    return this.service.disableById(user.account_id, id);
  }

  @Get('disabled')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Retrieving a list of disabled devices',
    description: 'Retrieving a list of disabled devices',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieving a list of disabled devices',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving a list of disabled devices',
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
    description: 'Search disabled devices',
    type: String,
    required: false,
    example: 'Iphone',
  })
  getDisableDevices(@Query('search') search = ''): Promise<Devices[]> {
    return this.service.getDisabledDevices(search);
  }

  @Put('restore-disabled/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Restore the disabled device by id',
    description: 'Restore the disabled device by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully restored the disabled device',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while restoring the disabled device',
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
    description: 'Restore disabled device',
    type: String,
    required: true,
    example: 'abcdef',
  })
  restoreDisabledDeviceById(
    @Param() payload: { id: string },
    @User() user: KeycloakUserInstance
  ) {
    return this.service.handleRestoreDisabledDeviceById(
      user.account_id,
      payload.id
    );
  }

  @Delete(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Removing the device by id',
    description: 'Removing the device by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully removed the device',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while removing the device',
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
    description: 'The ID of active or disabled device',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  deleteDeviceById(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string }
  ) {
    return this.service.deleteById(user.account_id, payload.id);
  }

  @Get('deleted')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Retrieve a list of deleted devices',
    description: 'Retrieve a list of deleted devices',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieving a list of deleted devices',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving a list of deleted devices',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getDeletedDevices(@Query('search') search = ''): Promise<Devices[]> {
    return this.service.getDeletedDevices(search);
  }

  // @Put('restore-deleted/:id')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  // @ApiOperation({
  //   summary: 'Restore the deleted device by id',
  //   description: 'Restore the deleted device by provided id',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully restored the deleted device',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Error while restoring the deleted device',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Invalid access token',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Insufficient privileges',
  // })
  // @ApiParam({
  //   name: 'id',
  //   description: 'Restore deleted device',
  //   type: String,
  //   required: true,
  //   example: 'abcdef',
  // })
  // restoreDeletedDeviceById(@Param() payload: { id: string }) {
  //   return this.service.handleRestoreDeletedDeviceById(payload.id);
  // }
}
