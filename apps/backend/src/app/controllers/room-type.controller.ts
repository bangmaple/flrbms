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
import {ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {RoomTypeService} from '../services/room-type.service';
import {MasterDataAddRequestPayload} from '../payload/request/master-data-add.request.payload';
import {Roles, User} from '../decorators';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {PathLoggerInterceptor} from '../interceptors';
import {Role} from '../enum';
import {PaginationParams} from '../dto/pagination.dto';


@Controller('/v1/room-type')
@ApiBearerAuth()
@ApiTags('Room Types')
@UseInterceptors(new PathLoggerInterceptor(RoomTypeService.name))
export class RoomTypeController {
  constructor(private readonly service: RoomTypeService) {
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched room types by pagination',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving the lists of room types',
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
    summary: 'Get room type by pagination',
    description: 'Get room type by pagination',
  })
  getRoomTypes(@Query() payload: PaginationParams) {
    return this.service.getRoomTypesWithPagination(payload);
  }

  @Get('name')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully get room types name',
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
    summary: 'Get room types name',
    description: 'Get room types name',
  })
  getRoomTypeNames() {
    return this.service.getRoomTypeNames();
  }

  @Get(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched room type by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for room type is not validated',
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
    summary: 'Get room type by id',
    description: 'Get room type by id',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of active room type",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  getRoomTypeById(@Param('id') id: string) {
    return this.service.getRoomTypeById(id);
  }

  @Post()
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add a new room type',
    description: 'Add a new room type',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully added room type',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for room type is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  addRoomType(
    @User() keycloakUser: KeycloakUserInstance,
    @Body() addRoomType: MasterDataAddRequestPayload
  ) {
    return this.service.addRoomType(keycloakUser.account_id, addRoomType);
  }

  @Put(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Update room type by id',
    description: 'Update room type by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated room type by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for room type is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of room type",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  updateRoomTypeById(
    @Param('id') id: string,
    @Body() updatePayload: MasterDataAddRequestPayload,
    @User() keycloakUser: KeycloakUserInstance
  ) {
    return this.service.updateRoomTypeById(
      keycloakUser.account_id,
      updatePayload,
      id
    );
  }

  @Delete(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted room type by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for delete room type is not validated',
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
    summary: 'Delete room type by id',
    description: 'Delete room type by id',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of active  room type",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  deleteRoomTypeById(
    @Param('id') id: string,
    @User() keycloakUser: KeycloakUserInstance
  ) {
    return this.service.deleteRoomTypeById(keycloakUser.account_id, id);
  }

  @Get('deleted')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted room types',
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
    summary: 'Get deleted room types',
    description: 'Get deleted room types',
  })
  getDeletedRoomTypes(@Query('search') search: string) {
    return this.service.getDeletedRoomTypes(search);
  }

  @Put('restore-deleted/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully restored deleted room by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for deleted room type is not validated',
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
    summary: 'Successfully restored deleted room type by id',
    description: 'Successfully restored deleted room type by id',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of deleted room type",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  restoreDeletedRoomTypeById(
    @Param('id') id: string,
    @User() keycloakUser: KeycloakUserInstance
  ) {
    return this.service.restoreDeletedRoomTypeById(keycloakUser.account_id, id);
  }

  @Delete('permanent/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully permanent deleted room type by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Request params for permanent delete room type is not validated',
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
    summary: 'Permanently delete room type by id',
    description: 'Permanently delete room type by id',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of deleted room type",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  permanentDeleteRoomTypeById(@Param('id') id: string) {
    return this.service.permanentDeleteRoomTypeById(id);
  }
}
