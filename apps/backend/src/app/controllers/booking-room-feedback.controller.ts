import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query,} from '@nestjs/common';
import {Roles, User} from '../decorators';
import {Role} from '../enum';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {PaginationParams} from '../dto/pagination.dto';
import {Pagination} from 'nestjs-typeorm-paginate';
import {BookingRoomFeedback} from '../models';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {BookingFeedbackSendRequestPayload} from '../payload/request/booking-feedback-send.request.payload';
import {BookingFeedbackService} from '../services/booking-feedback.service';

@Controller('/v1/booking-room-feedbacks')
@ApiTags('Booking Room Feedbacks')
export class BookingFeedbackController {
  constructor(private readonly service: BookingFeedbackService) {
  }

  @Get()
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Get all booking room feedbacks',
    description: 'Get the list of booking room feedbacks',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got get all booking room feedbacks',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getAllFeedbacks(
    @Query()
      payload: PaginationParams,
    @User() user: KeycloakUserInstance
  ): Promise<Pagination<BookingRoomFeedback> | BookingRoomFeedback[]> {
    return this.service.getAllFeedbacks(user.account_id, payload);
  }

  @Get(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Get booking room feedback by id',
    description: 'Get booking room feedback by id',
  })
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched booking room feedback by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for booking room feedback is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getFeedbackById(@Param('id') id: string) {
    return this.service.getFeedbackById(id);
  }

  @Post('send-feedback')
  @Roles(Role.APP_STAFF, Role.APP_LIBRARIAN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send booking room feedback',
    description: 'Send booking room feedback',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully added booking room feedback',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  addNewFeedbackType(
    @User() user: KeycloakUserInstance,
    @Body() payload: BookingFeedbackSendRequestPayload
  ) {
    return this.service.addNewFeedback(user.account_id, payload);
  }
}
