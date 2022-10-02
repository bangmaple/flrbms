import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query} from '@nestjs/common';
import {FeedbackTypeService} from '../services';
import {Role} from '../enum';
import {Roles, User} from '../decorators';
import {ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {PaginationParams} from '../dto/pagination.dto';
import {Pagination} from 'nestjs-typeorm-paginate';
import {FeedbackType} from '../models';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {MasterDataAddRequestPayload} from '../payload/request/master-data-add.request.payload';


@Controller('/v1/feedback-types')
@ApiBearerAuth()
@ApiTags('Feedback Types')
export class FeedbackTypeController {
  constructor(private readonly service: FeedbackTypeService) {
  }

  @Get()
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got get all feedback types',
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
    summary: 'Get all feedback types',
    description: 'Get all feedback types',
  })
  getAllDeviceTypes(
    @Query() payload: PaginationParams
  ): Promise<Pagination<FeedbackType>> {
    return this.service.getAllFeedbackTypes(payload as PaginationParams);
  }

  @Get('name')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got feedback type name',
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
    summary: 'Get feedback type name',
    description: 'Get feedback type name',
  })
  getFeedbackTypeNames() {
    return this.service.getFeedbackTypeNames();
  }

  @Get(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched feedback type by id',
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
    summary: 'Get feedback type by id',
    description: 'Get feedback type by id',
  })
  getFeedbackTypeById(@Param('id') id: string): Promise<FeedbackType> {
    return this.service.getFeedbackTypeById(id);
  }

  @Post()
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add a new feedback type',
    description: 'Add a new feedback type',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully added feedback type',
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
  addNewFeedbackType(
    @User() user: KeycloakUserInstance,
    @Body() payload: MasterDataAddRequestPayload
  ) {
    return this.service.addNewFeedbackType(user.account_id, payload);
  }

  @Put(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated feedback type by id',
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
    summary: 'Update feedback type by id',
    description: 'Update feedback type by id',
  })
  updateFeedbackTypeById(
    @Param('id') id: string,
    @Body() payload: MasterDataAddRequestPayload,
    @User() user: KeycloakUserInstance
  ) {
    return this.service.updateFeedbackTypeById(user.account_id, id, payload);
  }

  @Put('disable/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully disabled feedback types',
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
  @ApiOperation({
    summary: 'Delete feedback types',
    description: 'Delete feedback types',
  })
  disableFeedbackTypeById(
    @Param('id') id: string,
    @User() user: KeycloakUserInstance
  ) {
    return this.service.disableFeedbackTypeById(user.account_id, id);
  }

  @Get('disabled')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully disabled feedback types',
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
    summary: 'Get disabled feedback types',
    description: 'Get disabled feedback types',
  })
  @ApiParam({
    name: 'search',
    description: "Search disabled feedback types",
    type: String,
    required: false,
    example: 'Library Services',
  })
  getDisabledFeedbackTypes(@Query('search') search: string) {
    return this.service.getDisabledFeedbackTypes(search);
  }


  @Put('restore-disabled/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully restored deleted feedback by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for deleted feedback type is not validated',
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
    summary: 'Successfully restored deleted feedback type by id',
    description: 'Successfully restored deleted feedback type by id',
  })
  restoreDisabledTypeById(
    @Param('id') id: string,
    @User() keycloakUser: KeycloakUserInstance
  ) {
    return this.service.restoreDisabledFeedbackTypeById(keycloakUser.account_id, id);
  }

  // @Delete('permanent/:id')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully permanent deleted feedback type by id',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description:
  //     'Request params for permanent delete feedback type is not validated',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Access token is invalidated',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Insufficient privileges',
  // })
  // @ApiOperation({
  //   summary: 'Permanently delete feedback type by id',
  //   description: 'Permanently delete feedback type by id',
  // })
  // permanentlyDeleteFeedbackTypeById(@Param('id') id: string) {
  //   return this.service.permanentlyDeleteFeedbackTypeById(id);
  // }
}
