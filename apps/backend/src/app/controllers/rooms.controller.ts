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
import {RoomsService} from '../services';
import {Rooms} from '../models';
import {ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {PathLoggerInterceptor} from '../interceptors';
import {Roles, User} from '../decorators';
import {Role} from '../enum';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {RoomsPaginationParams} from '../dto/rooms-pagination.dto';
import {RoomAddRequestPayload} from '../payload/request/room-add.request.payload';


@Controller('/v1/rooms')
@ApiBearerAuth()
@ApiTags('Rooms')
@UseInterceptors(new PathLoggerInterceptor(RoomsController.name))
export class RoomsController {
  constructor(private readonly service: RoomsService) {
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Get the list of active rooms by pagination',
    description:
      'Get the list of active rooms with the provided pagination payload',
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
    description: 'Successfully fetched rooms',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges to access this endpoint',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getRooms(
    @Query() payload: RoomsPaginationParams) {
    return this.service.getAll(payload);
  }

  @Get('by-room-type')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get the list of active room by room types',
    description:
      'Get the list of active rooms with the provided pagination payload',
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
    description: 'Successfully fetched active room types',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getRoomsByRoomType(@Query('type') roomTypeId = ''): Promise<Rooms[]> {
    return this.service.getRoomsByRoomType(roomTypeId);
  }

  @Get('name')
  @ApiOperation({
    summary: 'Get the list of active room name',
    description:
      'Get the list of active room name',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully get role name',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving the library room names',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getRoomNames() {
    return this.service.getRoomNames();
  }

  @Get('find/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Retrieving the library room by id',
    description: 'Retrieving the library room by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the library room',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving the library room',
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
    description: "The ID of active room",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  getRoomById(@Param() payload: { id: string }): Promise<Rooms> {
    return this.service.findById(payload.id);
  }

  @Post('add')
  @Roles(Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_LIBRARIAN)
  @ApiOperation({
    summary: 'Create a new library room',
    description: 'Create new library room with the provided payload',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created a new library room',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request payload for library room is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  addRoom(
    @User() user: KeycloakUserInstance,
    @Body() room: RoomAddRequestPayload
  ): Promise<Rooms> {
    return this.service.add(user, room);
  }

  @Put('update/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Update library room by id',
    description: 'Update library room by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated the library room',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while updating the library room',
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
    description: "The ID of active room",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  updateRoomById(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string },
    @Body() body: RoomAddRequestPayload
  ) {
    return this.service.updateById(user.account_id, payload.id, body);
  }

  @Put('update-type-then-restore/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Update library room by id',
    description: 'Update library room by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated the library room',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while updating the library room',
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
    description: "The ID of active room",
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
    summary: 'Disable library room by id',
    description: 'Disable library room by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully disabled the library room',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while disabling the library room',
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
    description: "The ID of active room",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  disableRoomById(@User() user: KeycloakUserInstance, @Param('id') id: string) {
    return this.service.disableById(user.account_id, id);
  }

  @Get('disabled')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get disabled rooms',
    description: 'Get disabled rooms',
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
    description: 'Successfully fetched disabled rooms',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiParam({
    name: 'search',
    description: "Search disabled rooms",
    type: String,
    required: false,
    example: 'LB001',
  })
  getDisableRooms(
    @Query('search') search: string,
  ): Promise<Rooms[]> {
    return this.service.getDisabledRooms(search);
  }

  @Put('restore-disabled/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Restore the disabled library room by id',
    description: 'Restore the disabled library room by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully restored the disabled library room',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while restoring the disabled the library room',
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
    description: "The ID of disabled room",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  restoreDisabledRoomById(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string }
  ) {
    return this.service.handleRestoreDisabledRoomById(
      user.account_id,
      payload.id
    );
  }

  @Delete(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Remove library room by id',
    description: 'Remove library room by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully removed the library room',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while removing the library room',
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
    description: "The ID of active or disabled room",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  deleteRoomById(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string }
  ) {
    return this.service.deleteById(user.account_id, payload.id);
  }

  @Get('deleted')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get the list of deleted library rooms',
    description: 'Get the list of deleted library rooms',
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
    description: 'Successfully fetched deleted rooms',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiParam({
    name: 'search',
    description: "Search deleted rooms",
    type: String,
    required: false,
    example: 'LB001',
  })
  getDeletedRooms(@Query('search') search: string,): Promise<Rooms[]> {
    return this.service.getDeletedRooms(search);
  }

  // @Put('restore-deleted/:id')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  // @ApiOperation({
  //   summary: 'Restore the deleted library room by id',
  //   description: 'Restore the deleted library room by provided id',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully restored the deleted library room',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Error while restoring the deleted library room',
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
  //   description: "The ID of deleted room",
  //   type: String,
  //   required: true,
  //   example: 'ABCD1234',
  // })
  // restoreDeletedRoomById(
  //   @Param() payload: { id: string },
  //   @User() user: KeycloakUserInstance
  // ) {
  //   return this.service.handleRestoreDeletedRoomById(
  //     user.account_id,
  //     payload.id
  //   );
  // }
}
