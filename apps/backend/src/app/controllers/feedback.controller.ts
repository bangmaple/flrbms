import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query} from '@nestjs/common';
import {FeedbackService} from '../services';
import {Roles, User} from '../decorators';
import {BookingRoomStatus, Role} from '../enum';
import {ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Pagination} from 'nestjs-typeorm-paginate';
import {Feedback} from '../models';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {FeedbackSendRequestPayload} from '../payload/request/feedback-send.request.payload';
import {FeedbackReplyRequestPayload} from '../payload/request/feedback-resolve.request.payload';
import {FeedbackPaginationPayload} from '../payload/request/feedback-pagination.payload';

@Controller('/v1/feedbacks')
@ApiBearerAuth()
@ApiTags('Feedbacks')
export class FeedbackController {
  constructor(private readonly service: FeedbackService) {
  }

  @Get()
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got get all feedback',
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
    summary: 'Get all feedback',
    description: 'Get all feedback',
  })
  @ApiQuery({name: 'status', enum: BookingRoomStatus, required: false})
  getAllFeedbacks(
    @Query() payload: FeedbackPaginationPayload,
    @User() user: KeycloakUserInstance,
  ): Promise<Pagination<Feedback> | Feedback[]> {
    return this.service.getAllFeedbacks(user.account_id, payload);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get feedback by id',
    description: 'Get feedback by id',
  })
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched feedback by id',
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
  getFeedbackById(@Param('id') id: string) {
    return this.service.getFeedbackById(id);
  }

  @Post('send-feedback')
  @Roles(Role.APP_STAFF, Role.APP_LIBRARIAN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send feedback',
    description: 'Send feedback',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully added feedback',
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
  addNewFeedback(
    @User() user: KeycloakUserInstance,
    @Body() payload: FeedbackSendRequestPayload
  ) {
    return this.service.addNewFeedback(user.account_id, payload);
  }

  @Put('resolve/:id')
  @Roles(Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully resolve feedback by id',
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
    summary: 'Resolve feedback by id',
    description: 'Resolve feedback by id',
  })
  resolveFeedbackById(
    @Param('id') id: string,
    @Body() payload: FeedbackReplyRequestPayload,
    @User() user: KeycloakUserInstance
  ) {
    return this.service.resolveFeedbackById(user.account_id, id, payload);
  }

  @Put('reject/:id')
  @Roles(Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully Rejected feedback by id',
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
    summary: 'Rejected feedback by id',
    description: 'Rejected feedback by id',
  })
  rejectFeedbackById(
    @Param('id') id: string,
    @Body() payload: FeedbackReplyRequestPayload,
    @User() user: KeycloakUserInstance
  ) {
    return this.service.rejectFeedbackById(user.account_id, id, payload);
  }

  @Get('count')
  @ApiOperation({
    summary: 'Get count feedback requests',
    description: 'Get count feedback requests',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully getting count feedback requests',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while getting count feedback requests',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getCountRequestFeedbacks(@User() user: KeycloakUserInstance) {
    return this.service.getCountRequestFeedbacks(user.account_id);
  }

}
