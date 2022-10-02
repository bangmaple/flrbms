import {HolidaysService} from "../services";
import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseInterceptors} from "@nestjs/common";
import {ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Roles, User} from "../decorators";
import {Role} from "../enum";
import {KeycloakUserInstance} from "../dto/keycloak-user.dto";
import {Holidays, Rooms} from "../models";
import {HolidayAddRequestPayload} from "../payload/request/holidays-add.request.payload";
import {PathLoggerInterceptor} from "../interceptors";
import {PaginationParams} from "../dto/pagination.dto";

@Controller('/v1/holidays')
@ApiBearerAuth()
@ApiTags('Holidays')
@UseInterceptors(new PathLoggerInterceptor(HolidaysController.name))
export class HolidaysController {
  constructor(private readonly service: HolidaysService) {
  }

  @Get()
  @Roles(Role.APP_LIBRARIAN, Role.APP_ADMIN, Role.APP_STAFF)
  @ApiOperation({
    summary: 'Get the list of holidays by pagination',
    description:
      'Get the list of holidays with the provided pagination payload',
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
    description: 'Successfully fetched holidays',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges to access this endpoint',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getHolidays(
    @Query() payload: PaginationParams) {
    return this.service.getAll(payload);
  }


  @Get('mini')
  @ApiOperation({
    summary: 'Get the list of active holidays',
    description:
      'Get the list of active holidays',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully get holidays',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving the holiday names',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  getHolidayMini() {
    return this.service.getHolidayMini();
  }

  @Get('find/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Retrieving the holiday by id',
    description: 'Retrieving the holiday by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the holiday',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving the holiday',
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
    description: "The ID of active holiday",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  getHolidaysById(@Param() payload: { id: string }): Promise<Rooms> {
    return this.service.findById(payload.id);
  }


  @Post('add')
  @Roles(Role.APP_ADMIN, Role.APP_LIBRARIAN)
  @ApiOperation({
    summary: 'Create a new holiday',
    description: 'Create a new holiday with the provided payload',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created a new holiday',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request payload for holiday is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  addHoliday(
    @User() user: KeycloakUserInstance,
    @Body() holidays: HolidayAddRequestPayload
  ): Promise<Holidays> {
    return this.service.add(user, holidays);
  }

  @Post('import')
  @Roles(Role.APP_ADMIN, Role.APP_LIBRARIAN)
  @ApiOperation({
    summary: 'Create a new holiday',
    description: 'Create a new holiday with the provided payload',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created a new holiday',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request payload for holiday is not validated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  importHoliday(
    @User() user: KeycloakUserInstance,
    @Body() payload: { file: any[] }
  ): Promise<Holidays> {
    return this.service.import(user, payload.file);
  }

  @Put('update/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Update holiday by id',
    description: 'Update holiday by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated the holiday',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while updating the holiday',
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
    description: "The ID of active holiday",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  updateHolidayById(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string },
    @Body() body: HolidayAddRequestPayload
  ): Promise<Holidays> {
    return this.service.updateById(user.account_id, payload.id, body);
  }

  @Delete(':id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Remove holiday by id',
    description: 'Remove holiday by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully removed the holiday',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while removing the holiday',
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
    description: "The ID of active holiday",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  deleteHolidayById(
    @User() user: KeycloakUserInstance,
    @Param() payload: { id: string }
  ) {
    return this.service.deleteById(user.account_id, payload.id);
  }

  @Get('deleted')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Get the list of deleted holidays',
    description: 'Get the list of deleted holidays',
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
    description: 'Successfully fetched deleted holidays',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiParam({
    name: 'search',
    description: "Search deleted holidays",
    type: String,
    required: false,
    example: 'Independence Day',
  })
  getDeletedRooms(@Query('search') search: string,): Promise<Holidays[]> {
    return this.service.getDeletedHolidays(search);
  }

  @Put('restore-deleted/:id')
  @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  @ApiOperation({
    summary: 'Restore the deleted holiday by id',
    description: 'Restore the deleted holiday by provided id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully restored the deleted holiday',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while restoring the deleted holiday',
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
    description: "The ID of deleted holiday",
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  restoreDeletedHolidayById(
    @Param() payload: { id: string },
    @User() user: KeycloakUserInstance
  ) {
    return this.service.restoreDeletedHolidayById(
      user.account_id,
      payload.id
    );
  }


}
