import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query,} from '@nestjs/common';
import {BookingReasonService} from '../services/booking-reason.service';
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Roles, User} from '../decorators';
import {Role} from '../enum';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {PaginationParams} from '../dto/pagination.dto';
import {MasterDataAddRequestPayload} from "../payload/request/master-data-add.request.payload";

@Controller('/v1/booking-reasons')
@ApiTags('Booking Reason')
export class BookingReasonController {
  constructor(private readonly service: BookingReasonService) {
  }

  @Get()
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched booking reason by pagination',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for booking reason is not validated',
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
    summary: 'Get booking reason type by pagination',
    description: 'Get booking reason type by pagination',
  })
  getBookingReasonTypes(@Query() payload: PaginationParams) {
    return this.service.getBookingReasonTypesWithPagination(
      payload as PaginationParams
    );
  }

  @Get('name')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got booking reason',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for booking reason is not validated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiOperation({
    summary: 'Get booking reason',
    description: 'Get booking reason',
  })
  getBookingReasonNames() {
    return this.service.getBookingReasonNames();
  }

  @Get(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched room type by id',
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
    summary: 'Get booking-reason by id',
    description: 'Get booking-reason by id',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of booking reason",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  getBookingReasonById(@Param('id') id: string) {
    return this.service.getBookingReasonById(id);
  }

  @Post()
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Add a new booking reason',
    description: 'Add a new booking reason',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully added booking reason',
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
  addNewBookingReason(
    @User() user: KeycloakUserInstance,
    @Body() payload: MasterDataAddRequestPayload
  ) {
    return this.service.createNewBookingReason(user.account_id, payload);
  }

  @Put(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated booking-reason by id',
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
    summary: 'Update booking-reason by id',
    description: 'Update booking-reason by id',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of booking room",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  updateBookingReasonById(
    @Body() payload: MasterDataAddRequestPayload,
    @Param('id') id: string,
    @User() user: KeycloakUserInstance
  ) {
    return this.service.updateBookingReasonById(user.account_id, payload, id);
  }

  @Delete(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted booking reason',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for deleted booking reason is not validated',
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
    summary: 'Deleted booking reason by ID',
    description: 'Use booking-reason-id to delete booking reason',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of booking reason",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  deleteBookingReasonById(
    @Param('id') id: string,
    @User() user: KeycloakUserInstance
  ) {
    return this.service.deleteBookingReasonById(user.account_id, id);
  }

  @Get('deleted')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got the list of deleted reasons',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for booking reason is not validated',
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
    summary: 'Get deleted reason',
    description: 'Get deleted reason',
  })
  getDeletedBookingReasons(@Query('search') search: string) {
    return this.service.getDeletedReasons(search);
  }

  @Put('restore-deleted/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully restored deleted booking reason by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Request params for deleted booking reason is not validated',
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
    summary: 'Successfully restored deleted booking reason by id',
    description: 'Successfully restored deleted booking reason by id',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of deleted booking reason",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  restoreDeletedReasonById(
    @User() keycloakUser: KeycloakUserInstance,
    @Param('id') id: string
  ) {
    return this.service.restoreDeletedReasonById(keycloakUser.account_id, id);
  }

  @Delete('permanent/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully permanent booking reason by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Request params for permanent booking reason is not validated',
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
    summary: 'Permanently delete booking reason by id',
    description: 'Permanently delete booking reason by id',
  })
  @ApiParam({
    name: 'id',
    description: "The ID of deleted booking reason",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  permanentlyDeleteReasonById(@Param('id') id: string) {
    return this.service.permanentlyDeleteReasonById(id);
  }
}
