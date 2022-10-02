import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {BookingRoomService} from '../services';
import {Roles, User} from '../decorators';
import {ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {PathLoggerInterceptor} from '../interceptors';
import {Role} from '../enum';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {BookingRequest} from '../models';
import {BookingRequestAddRequestPayload} from '../payload/request/booking-request-add.payload';
import {GetAllBookingRequestsFilter} from '../payload/request/get-all-booking-rooms-filter.payload';
import {CancelRequestPayload} from '../payload/request/booking-request-cancel.payload';
import {BookingRoomPaginationParams} from '../dto/booking-room-pagination.dto';
import {AutoRoomBookingRequestPayload} from "../payload/request/auto-booking-request.payload";

@Controller('/v1/booking-room')
@ApiTags('Booking Room')
@UseInterceptors(new PathLoggerInterceptor(BookingRoomController.name))
@ApiBearerAuth()
export class BookingRoomController {
  constructor(private readonly service: BookingRoomService
  ) {
  }

  @Get('search')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Get all booking room by pagination',
    description:
      'Get the list of booking rooms with the provided pagination payload',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got the list of booking rooms',
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
  getAllBookingRoomsPagination(
    @Query() payload: BookingRoomPaginationParams,
    @User() user: KeycloakUserInstance
  ) {
    return this.service.getAllBookingRoomsPagination(payload, user.account_id);
  }

  // @Get('check-slot-over-time')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  // @ApiOperation({
  //   summary: 'Check slot over time',
  //   description: 'Check slot over time',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully checked slot over time',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Error while checking slot over time is invalid',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Access token is invalid',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Not enough privileges',
  // })
  // checkSlotOverTime(
  //   @Query('slotin', new DefaultValuePipe('')) slotin: string,
  //   @Query('date', new DefaultValuePipe('')) date: string
  // ) {
  //   return this.service.checkSlotOverTime({
  //     slotin: slotin,
  //     date: date,
  //   });
  // }

  // @Get('list-booking-by-room-in-week')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  // @ApiOperation({
  //   summary: 'Get a list booking by room in week',
  //   description: 'Get a list booking by room in week',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully got slot over time',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Error while getting slot over time is invalid',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Access token is invalid',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Not enough privileges',
  // })
  // getBookingByRoomInWeek(
  //   @Query('roomId', new DefaultValuePipe('')) roomId: string,
  //   @Query('date', new DefaultValuePipe('')) date: string
  // ) {
  //   return this.service.getBookingByRoomInWeek({
  //     roomId: roomId,
  //     date: date,
  //   });
  // }

  // @Get('list-booking-by-slot')
  // @ApiOperation({
  //   summary: 'Get a list booking by slotID',
  //   description: 'Get a list booking by slotID',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully got a list booking by slot',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Error while getting a list booking is invalid',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Access token is invalid',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Not enough privileges',
  // })
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  // getBookingBySlot(@Query('slotId', new DefaultValuePipe('')) slotId: string) {
  //   return this.service.getRequestBySlotId(slotId);
  // }

  @Get('list-booking-by-room')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get a list booking by roomID',
    description: 'Get a list booking by roomID',
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
    description: 'Successfully fetched a list booking',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getRequestByRoomId(@Query('roomId') roomId = ''): Promise<BookingRequest[]> {
    return this.service.getRequestByRoomId(roomId);
  }

  @Get('list-booking-by-device')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get a list booking by deviceID',
    description: 'Get a list booking by deviceID',
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
    description: 'Successfully fetched a list booking room by deviceID',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getRequestByDeviceId(
    @Query('deviceId') deviceId = ''
  ): Promise<BookingRequest[]> {
    return this.service.getRequestByDeviceId(deviceId);
  }

  @Post('auto-booking')
  @Roles(Role.APP_LIBRARIAN, Role.APP_ADMIN, Role.APP_STAFF)
  requestRoomBookingAutomatically(
    @User() keycloakUser: KeycloakUserInstance,
    @Body() payload: AutoRoomBookingRequestPayload) {
    return this.service.bookingRoomAutomatically(payload, keycloakUser.account_id);
  }

  // @Get('list-booking-with-same-slot')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  // @ApiOperation({
  //   summary: 'Get a list booking with same slot',
  //   description: 'Get a list booking with same slot',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Access token is invalidated',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'One or more payload parameters are invalid',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully fetched a list booking room with same slot',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Insufficient privileges',
  // })
  // getRequestWithSameSlot(
  //   @Query('checkinSlotId', new DefaultValuePipe('')) checkinSlotId: string,
  //   @Query('checkoutSlotId', new DefaultValuePipe('')) checkoutSlotId: string,
  //   @Query('roomId', new DefaultValuePipe('')) roomId: string,
  //   @Query('requestId', new DefaultValuePipe('')) requestId: string,
  //   @Query('date', new DefaultValuePipe('')) date: string
  // ) {
  //   return this.service.getRequestOfRoomWithSameSlot({
  //     roomId: roomId,
  //     requestId: requestId,
  //     date: date,
  //     checkinSlotId: checkinSlotId,
  //     checkoutSlotId: checkoutSlotId,
  //   });
  // }

  @Get('list-room-free-at-time')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Get a room free at time',
    description: 'Get a room free at time',
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
    description: 'Successfully fetched a list room free at time',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getRoomFreeAtTime(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('checkinTime', new DefaultValuePipe('')) checkinTime: string,
    @Query('checkoutTime', new DefaultValuePipe('')) checkoutTime: string,
    @Query('date', new DefaultValuePipe('')) date: string,
    @Query('capacity', new DefaultValuePipe(1)) capacity: number
  ) {
    return this.service.getRoomFreeAtTime({
      search: search,
      date: date,
      checkinTime: checkinTime,
      checkoutTime: checkoutTime,
      capacity: capacity
    });
  }

  // @Get('list-room-free-at-multi-date')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  // @ApiOperation({
  //   summary: 'Get a list room free a multi date',
  //   description: 'Get a list room free a multi date',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Access token is invalidated',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'One or more payload parameters are invalid',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully fetched a list room free at time',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Insufficient privileges',
  // })
  // getRoomFreeAtMultiDate(
  //   @Query('search', new DefaultValuePipe('')) search: string,
  //   @Query('checkinSlot', new DefaultValuePipe('')) checkinSlot: number,
  //   @Query('checkoutSlot', new DefaultValuePipe('')) checkoutSlot: number,
  //   @Query('dateStart', new DefaultValuePipe('')) dateStart: string,
  //   @Query('dateEnd', new DefaultValuePipe('')) dateEnd: string
  // ) {
  //   return this.service.getRoomFreeAtMultiDate({
  //     search: search,
  //     dateStart: dateStart,
  //     dateEnd: dateEnd,
  //     checkinSlot: checkinSlot,
  //     checkoutSlot: checkoutSlot,
  //   });
  // }

  @Get('list-room-free-at-multi-date-v2')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Get a list room free a multi date',
    description: 'Get a list room free a multi date',
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
    description: 'Successfully fetched a list room free at time',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getRoomFreeAtMultiDateV2(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('checkinTime', new DefaultValuePipe('')) checkinTime: string,
    @Query('checkoutTime', new DefaultValuePipe('')) checkoutTime: string,
    @Query('dateStart', new DefaultValuePipe('')) dateStart: string,
    @Query('capacity', new DefaultValuePipe(1)) capacity: number,
    @Query('dateEnd', new DefaultValuePipe('')) dateEnd: string
  ) {
    return this.service.getRoomFreeAtMultiDateV2({
      search: search,
      dateStart: dateStart,
      dateEnd: dateEnd,
      capacity: capacity,
      checkinTime: checkinTime,
      checkoutTime: checkoutTime,
    });
  }

  // @Get('get-booked-requests')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  // @ApiOperation({
  //   summary: 'Get booked requests',
  //   description: 'Get booked requests',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Access token is invalidated',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'One or more payload parameters are invalid',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully got booked requests',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Insufficient privileges',
  // })
  // getListRequestBookedInDayAndSlot(
  //   @Query('checkinSlotId', new DefaultValuePipe('')) checkinSlotId: string,
  //   @Query('checkoutSlotId', new DefaultValuePipe('')) checkoutSlotId: string,
  //   @Query('date', new DefaultValuePipe('')) date: string
  // ) {
  //   return this.service.getListRequestBookedSameTime({
  //     date: date,
  //     checkinSlotId: checkinSlotId,
  //     checkoutSlotId: checkoutSlotId,
  //   });
  // }

  @Get('by-account-id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get booking room by accountID',
    description: 'Get booking room by accountID',
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
  getRequestBookingByAccountId(
    @Query('account-id') accountId = ''
  ): Promise<BookingRequest[]> {
    return this.service.getRequestBookingByAccountId(accountId);
  }

  @Get('devices-use-in-request/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Get devices use in request by ID',
    description: 'Get devices use in request by ID',
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
    description: 'Successfully fetched devices use in request',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getDevicesUseInRequest(
    @Param('id') requestId: string
  ): Promise<BookingRequest[]> {
    return this.service.getDevicesUseInRequest(requestId);
  }

  @Get('filter')
  @ApiOperation({
    summary: 'Get all booking requests by filter',
    description: 'Get all booking requests by filter',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got all booking request by filter',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while getting all booking request by filter',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getAllBookingRoomRequestsByFilter(
    @Query() filters: GetAllBookingRequestsFilter,
    @User() user: KeycloakUserInstance
  ) {
    return this.service.getAllBookingRoomsRequestsByFilter(
      user.account_id,
      filters
    );
  }

  @Get('find/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Retrieving booking room detail',
    description: 'Retrieving a booking room detail',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved a list of booking rooms',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving a list of booking rooms',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getBookingRoomById(@Param('id') id: string) {
    return this.service.getBookingRoomById(id);
  }

  // @Get('rooms')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  // getChoosingBookingRooms(@Query('filter') filter: string) {
  //   return this.service.getChoosingBookingRooms(filter);
  // }

  @Get('current-booking-list')
  @ApiOperation({
    summary: 'Get current booking list',
    description: 'Get current booking list',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got a current booking list',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while getting a current booking list',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  getCurrentRoomBookingListOfCurrentUser(@User() user: KeycloakUserInstance) {
    return this.service.getCurrentRoomBookingList(user.account_id);
  }

  @Get('/statistics')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Retrieving a statistic of booking rooms',
    description: 'Retrieving a statistic of booking rooms',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved a statistic of booking rooms',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving a statistic of booking rooms',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getStatistics() {
    return this.service.getStatistics();
  }

  @Get('/count-request/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Retrieving a count of booking rooms',
    description: 'Retrieving a count of booking rooms',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved a count of booking rooms',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving a count of booking rooms',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getCountRequestInWeekOfUser(
    @Param() payload: { id: string },
    @Query('date') date: string
  ) {
    return this.service.getCountRequestInWeekOfUser(payload.id, date);
  }

  // @Get()
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  // @ApiOperation({
  //   summary: 'Retrieving a list of booking rooms',
  //   description: 'Retrieving a list of booking rooms',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully retrieved a list of booking rooms',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Error while retrieving a list of booking rooms',
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
  //   name: 'roomName',
  //   description: 'The name of the library room',
  //   example: 'LB01',
  //   type: String,
  //   required: true,
  // })
  // getBookingRooms(
  //   @Query('search') search: string,
  //   @Query('sorting') sorting: string,
  //   @Query('slot') slot: number
  // ): Promise<BookingRoomResponseDTO[]> {
  //   return this.service.getBookingRooms({
  //     sorting: sorting,
  //     search: search,
  //     slot: slot,
  //   });
  // }

  @Get('get-room-name-booked-same-time')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Get room name have booked in same slot',
    description: 'Get room name have booked in same slot',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully get room name have booked in same slot',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request payload for request is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getRoomNameBookedSameSlot(
    @Query('checkinDate') checkinDate: string,
    @Query('userId') userId: string,
    @Query('timeStart') timeStart: string,
    @Query('timeEnd') timeEnd: string
  ) {
    return this.service.checkAlreadyHaveBookingSameSlotV2({
      checkinDate: checkinDate,
      userId: userId,
      timeStart: timeStart,
      timeEnd: timeEnd,
    });
  }

  @Get('list-request-in-day-range')
  @Roles(Role.APP_LIBRARIAN, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get the list request in day range',
    description:
      'Get the list request in day range',
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
    description: 'Successfully fetched request',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges to access this endpoint',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getListRequestInDayRange(
    @Query('dateStart') dateStart: string,
    @Query('dateEnd') dateEnd: string,
  ) {
    return this.service.getListRequestInDayRange({
      dateStart: dateStart,
      dateEnd: dateEnd,
    });
  }

  @Get('get-room-name-booked-same-slot-multi')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Get room name have booked in same slot',
    description: 'Get room name have booked in same slot',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully get room name have booked in same slot',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request payload for request is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  checkAlreadyHaveBookingSameSlotMultiDay(
    @Query('checkinDate') checkinDate: string,
    @Query('checkoutDate') checkoutDate: string,
    @Query('userId') userId: string,
    @Query('checkinTime') checkinTime: string,
    @Query('checkoutTime') checkoutTime: string
  ) {
    return this.service.checkAlreadyHaveBookingSameSlotMultiDay({
      checkinDate: checkinDate,
      checkoutDate: checkoutDate,
      userId: userId,
      checkinTime: checkinTime,
      checkoutTime: checkoutTime,
    });
  }

  @Post('new-request')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Create a new request',
    description: 'Create new request with the provided payload',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created a new request',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request payload for request is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  addNewRequest(
    @User() user: KeycloakUserInstance,
    @Body() request: BookingRequestAddRequestPayload
  ) {
    return this.service.addNewRequest(request, user.account_id);
  }

  @Post('multi-booking')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Create a multi request',
    description: 'Create multi request with the provided payload',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created a multi request',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request payload for request is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  addMultiRequest(
    @User() user: KeycloakUserInstance,
    @Body() request: BookingRequestAddRequestPayload
  ) {
    return this.service.addMultiRequest(request, user.account_id);
  }

  @Put('update-list-device')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Update list device of request booking',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully update list device of request',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request payload for request is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  updateListDevice(
    @User() user: KeycloakUserInstance,
    @Body() request: {requestId: string, listDevice: any[]}
  ) {
    return this.service.updateListDevice(request, user.account_id);
  }

  // @Put('accept/:id')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  // @ApiOperation({
  //   summary: 'Accept request by id',
  //   description: 'Accept request by provided id',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully accept the request',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Error while accept the request',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Invalid access token',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Insufficient privileges',
  // })
  // acceptRequestById(
  //   @User() user: KeycloakUserInstance,
  //   @Param() payload: { id: string }
  // ) {
  //   return this.service.acceptById(user.account_id, payload.id);
  // }

  @Put('accept-checkin/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Accept checking by id',
    description: 'Accept request by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully accepted the request',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while accepting the request',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  acceptCheckInBookingRequestById(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string }
  ) {
    return this.service.acceptCheckinById(user.account_id, payload.id);
  }

  // @Put('reject-checkin/:id')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  // @ApiOperation({
  //   summary: 'Reject checking by id',
  //   description: 'Reject request by provided id',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully accepted the request',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Error while rejecting the request',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Invalid access token',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Insufficient privileges',
  // })
  // rejectCheckinRequestById(
  //   @Param('id') id: string,
  //   @Body() payload: CancelRequestPayload,
  //   @User() user: KeycloakUserInstance
  // ) {
  //   return this.service.rejectCheckinById(user.account_id, id, payload.reason);
  // }

  @Put('accept-checkout/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Accept booking room checkout by id',
    description: 'Accept request checkout by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully accepted the request',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while rejecting the request',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  acceptCheckOutBookingRequestById(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string }
  ) {
    return this.service.acceptCheckoutById(user.account_id, payload.id);
  }

  @Get('is-holiday')
  @Roles(Role.APP_LIBRARIAN, Role.APP_STAFF, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Check if it is holiday',
    description: 'Check if it is holiday by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'This date is holidays',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while checking if it is holiday',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  isHoliday(
    @Query('dateStart', new DefaultValuePipe('')) dateStart: string,
    @Query('dateEnd', new DefaultValuePipe('')) dateEnd: string
  ) {
    return this.service.isHoliday(dateStart, dateEnd);
  }


  // @Put('reject-checkout/:id')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  // @ApiOperation({
  //   summary: 'Reject room checkout by id',
  //   description: 'Reject room checkout by provided id',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully rejected the request',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Error while rejecting the request',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Invalid access token',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Insufficient privileges',
  // })
  // rejectCheckOutRequestById(
  //   @Param('id') id: string,
  //   @Body() payload: CancelRequestPayload,
  //   @User() user: KeycloakUserInstance
  // ) {
  //   return this.service.rejectCheckoutById(user.account_id, id, payload.reason);
  // }

  // @Put('reject/:id')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  // @ApiOperation({
  //   summary: 'Reject request by ID',
  //   description: 'Reject request by provided ID',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully rejected the request',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Error while rejecting the request',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Invalid access token',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Insufficient privileges',
  // })
  // rejectRequestById(
  //   @Param('id') id: string,
  //   @Body() payload: CancelRequestPayload,
  //   @User() user: KeycloakUserInstance
  // ) {
  //   return this.service.rejectById(user.account_id, id, payload.reason);
  // }

  @Put('cancel/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Cancel request by ID',
    description: 'Cancel request by provided ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully cancelled the request',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while cancelling the request',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  cancelRoomBookingById(
    @Param('id') id: string,
    @Body() payload: CancelRequestPayload,
    @User() user: KeycloakUserInstance
  ) {
    return this.service.cancelRoomBookingById(
      user.account_id,
      id,
      payload.reason
    );
  }

  // @Get('accounts-name')
  // @ApiOperation({
  //   summary: 'Get account names',
  //   description: 'Get a list of account names',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully got account names',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Error while getting a list of accounts name',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Invalid access token',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Insufficient privileges',
  // })
  // getUsernameList() {
  //   return this.service.getUsernameList();
  // }

  // @Get('rooms-name')
  // getRoomsName() {
  //   return this.service.getRoomNames();
  // }

  // @Get('devices')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_ADMIN, Role.APP_MANAGER, Role.APP_STAFF)
  // getBookingRoomDevices(
  //   @Query('name') name: string,
  //   @Query('type') type: string,
  //   @Query('sort') sort: string
  // ) {
  //   return this.service.getBookingRoomDevices(name, type, sort);
  // }


  @Get('check-in')
  @ApiOperation({
    summary: 'Get current booking checked-in requests ',
    description: 'Get current booking checked-in requests',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got current booking checked-in requests',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while getting current booking checked-in requests',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getCurrentBookingCheckin(@User() user: KeycloakUserInstance) {
    return this.service.getCurrentBookingCheckin(user.account_id);
  }

  @Post('attempt-checkin/:id')
  @ApiOperation({
    summary: 'Attempt checked-in request by ID',
    description: 'Attempt checked-in request by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully attempted checked-in requests',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while attempting checkin requests',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  attemptCheckin(
    @User() user: KeycloakUserInstance,
    @Param('id') bookingRequestId: string,
    @Body()
      checkinSignature: {
      signature: string;
    }
  ) {
    return this.service.attemptCheckin(
      user.account_id,
      bookingRequestId,
      checkinSignature
    );
  }

  @Get('count/')
  @ApiOperation({
    summary: 'Get count booking requests',
    description: 'Get count booking requests',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully getting count booking requests',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while getting count booking requests',
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
    name: 'accountId',
    description: 'Account ID booked for',
    example: 'abcd-add',
    type: String,
    required: true,
  })
  countRequestBooking(@User() user: KeycloakUserInstance) {
    return this.service.countRequestBooking(user.account_id);
  }

  @Get('check-out')
  @ApiOperation({
    summary: 'Get current checked-out booking requests ',
    description: 'Get current checked-out booking requests',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got checked-out requests',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while checking out requests',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getCurrenBookingCheckoutInformation(@User() user: KeycloakUserInstance) {
    return this.service.getCurrentBookingCheckoutInformation(user.account_id);
  }

  @Post('attempt-checkout/:id')
  @ApiOperation({
    summary: 'Attempt checked-out request by ID',
    description: 'Attempt checked-out request by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully attempted checked-out requests',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while attempting check-out requests',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  attemptCheckout(
    @User() user: KeycloakUserInstance,
    @Param('id') bookingRequestId: string,
    @Body()
      checkinSignature: {
      signature: string;
    }
  ) {
    return this.service.attemptCheckout(
      user.account_id,
      bookingRequestId,
      checkinSignature
    );
  }

  @Post('check-out/:id')
  @ApiOperation({
    summary: 'Check out booking room request by ID',
    description: 'Check out booking room request by provided ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully checking out requests',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while checking out requests',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  checkoutBookingRoom(
    @Param('id') bookingRoomId: string,
    @User() keycloakUser: KeycloakUserInstance
  ) {
    return this.service.checkOutBookingRoom(
      bookingRoomId,
      keycloakUser.account_id
    );
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get all booking room history',
    description: 'Get all booking room history',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got all booking room history',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while getting booking room history',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getAllBookingRoomHistory(
    @User() keycloakUser: KeycloakUserInstance,
    @Query() filters: GetAllBookingRequestsFilter
  ) {
    return this.service.getAllBookingRoomHistory(
      keycloakUser.account_id,
      filters
    );
  }
}
