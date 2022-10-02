import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put,} from '@nestjs/common';
import {SlotService} from '../services/slot.service';
import {Roles} from '../decorators';
import {Role} from '../enum';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {SlotsConfigRequestPayload} from "../payload/request/slot-config-request-add.payload";


@Controller('/v1/slots')
@ApiBearerAuth()
@ApiTags('Slots')
export class SlotController {
  constructor(private readonly service: SlotService) {
  }


  @Get()
  @Roles(Role.APP_ADMIN, Role.APP_STAFF, Role.APP_LIBRARIAN)
  @ApiOperation({
    summary: 'Get all slots',
    description: 'Get the list of slots',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched slots',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving slots',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not enough privileges',
  })
  getSlots(): Promise<any> {
    return this.service.getAll();
  }

  @Get(':id')
  @Roles(Role.APP_ADMIN, Role.APP_STAFF, Role.APP_LIBRARIAN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully get a slot by ID',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params is not validated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiOperation({
    summary: 'Get a slot by ID',
    description: 'Get a slot by ID',
  })
  getSlotById(@Param() payload: { id: string },
  ) {
    return this.service.getById(payload.id);
  }

  @Post()
  @Roles(Role.APP_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add a new slot',
    description: 'Add a new slot',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully added a new slot',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while adding a new slot',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  addNewSlot(
    @Body() slotConfig: SlotsConfigRequestPayload
  ) {
    return this.service.addNewSlot(slotConfig);
  }

  @Put('update/:key')
  @Roles(Role.APP_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update slot',
    description: 'Update slot',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated a slot',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while updating a new slot',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is invalidated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  updateSlot(
    @Param('key') key: string,
    @Body() slotConfig: SlotsConfigRequestPayload
  ) {
    return this.service.updateSlot(key, slotConfig);
  }

  @Delete(':key')
  @Roles(Role.APP_ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted slots',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request params for slots is not validated',
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
    summary: 'Delete a slot',
    description: 'Delete a slot',
  })
  deleteSlot(@Param('key') key: string) {
    return this.service.deleteSlot(key);
  }


  // @Get()
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  // @ApiOperation({
  //   summary: 'Get all slots',
  //   description: 'Get the list of slots',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully fetched slots',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Error while retrieving slots',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Access token is invalid',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Not enough privileges',
  // })
  // getAllSlotsByPagination(@Optional() @Query() params?: PaginationParams) {
  //   return this.service.getAllByPagination(params);
  // }

  // @Get('name')
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully get slot names',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Access token is invalidated',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Request params is not validated',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Insufficient privileges',
  // })
  // @ApiOperation({
  //   summary: 'Get slot names',
  //   description: 'Get slot names',
  // })
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN, Role.APP_STAFF)
  // getSlotNames() {
  //   return this.service.getSlotNames();
  // }


  // @Post()
  // @Roles(Role.APP_ADMIN)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({
  //   summary: 'Add a new slot',
  //   description: 'Add a new slot',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully added a new slot',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Error while adding a new slot',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Access token is invalidated',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Insufficient privileges',
  // })
  // addNewSlot(
  //   @User() user: KeycloakUserInstance,
  //   @Body() payload: SlotsRequestPayload
  // ) {
  //   return this.service.addNewSlot(user.account_id, payload);
  // }


  // @Get('deleted')
  // @Roles(Role.APP_LIBRARIAN, Role.APP_MANAGER, Role.APP_ADMIN)
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully deleted slot',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Request params for slots is not validated',
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
  //   summary: 'Get deleted slot',
  //   description: 'Get deleted slot',
  // })
  // @ApiParam({
  //   name: 'search',
  //   description: "Search deleted slots",
  //   type: String,
  //   required: false,
  //   example: 'Slot 5',
  // })
  // getDeletedSlots(@Query('search') search: string) {
  //   return this.service.getDeletedSlots(search);
  // }

  // @Put('restore-deleted/:id')
  // @Roles(Role.APP_ADMIN)
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully restored deleted slot by id',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Request params for deleted slot is not validated',
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
  //   summary: 'Successfully restored deleted slot by id',
  //   description: 'Successfully restored deleted slot by id',
  // })
  // restoreDeletedSlotById(
  //   @Param('id') id: string,
  //   @User() keycloakUser: KeycloakUserInstance
  // ) {
  //   return this.service.restoreDeletedSlotById(keycloakUser.account_id, id);
  // }

}
