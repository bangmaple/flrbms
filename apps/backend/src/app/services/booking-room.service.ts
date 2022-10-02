import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {RoomsService} from './rooms.service';
import {BookingRoomRepository} from '../repositories';
import {AccountsService} from './accounts.service';
import {HolidaysService} from './holidays.service';
import {BookingRequest} from '../models';
import {BookingRequestAddRequestPayload} from '../payload/request/booking-request-add.payload';
import {BookingRequestHistService} from './booking-room-hist.service';
import {SlotService} from './slot.service';
import {DataSource, QueryRunner} from 'typeorm';
import {BookingRoomDevicesService} from './booking-request-devices.service';
import {GetAllBookingRequestsFilter} from '../payload/request/get-all-booking-rooms-filter.payload';
import {NotificationService} from './notification.service';
import {BookingRoomPaginationParams} from '../dto/booking-room-pagination.dto';
import {BookingFeedbackService} from './booking-feedback.service';
import {getConfigFileLoaded} from '../controllers/global-config.controller';
import {
  AutoRoomBookingDevice,
  AutoRoomBookingRequest,
  AutoRoomBookingRequestPayload,
  AutoRoomBookingResponsePayload,
} from '../payload/request/auto-booking-request.payload';
import {DevicesService} from './devices.service';
import {BookingReasonService} from './booking-reason.service';
import dayjs = require('dayjs');
import { KeycloakUserInstance } from '../dto/keycloak-user.dto';

@Injectable()
export class BookingRoomService {
  private static REGEX_24_HOUR = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
  private readonly logger = new Logger(BookingRoomService.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => BookingRoomRepository))
    private readonly repository: BookingRoomRepository,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => AccountsService))
    private readonly accountService: AccountsService,
    @Inject(forwardRef(() => SlotService))
    private readonly slotService: SlotService,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomService: RoomsService,
    @Inject(forwardRef(() => BookingRoomDevicesService))
    private readonly bookingRoomDeviceService: BookingRoomDevicesService,
    @Inject(forwardRef(() => BookingFeedbackService))
    private readonly bookingFeedbackService: BookingFeedbackService,
    private readonly histService: BookingRequestHistService,
    @Inject(forwardRef(() => HolidaysService))
    private readonly holidaysService: HolidaysService,
    @Inject(forwardRef(() => DevicesService))
    private readonly devicesService: DevicesService,
    @Inject(forwardRef(() => BookingReasonService))
    private readonly bookingReasonService: BookingReasonService
  ) {
  }

  async getStatistics() {
    const result = this.getExampleStatistics();
    const today = new Date().setHours(0, 0, 0, 0);
    const curr = new Date();
    const firstDayInWeek = curr.getDate() - curr.getDay() + 2; // First day is the day of the month - the day of the week
    const lastDayInWeek = firstDayInWeek + 6; // last day is the first day + 6
    const sunday = new Date(curr.setDate(firstDayInWeek)).setHours(0, 0, 0, 0);
    const satuday = new Date(curr.setDate(lastDayInWeek)).setHours(0, 0, 0, 0);
    const firstDayInMonth = new Date(curr.setDate(2)).setHours(0, 0, 0, 0);
    const lastDayInMonth = new Date(
      curr.getFullYear(),
      curr.getMonth() + 1,
      1
    ).setHours(0, 0, 0, 0);
    const allRequest = await this.repository.getAllRequest();

    for (let i = 0; i < allRequest.length; i++) {
      const checkinDate = allRequest[i].checkinDate.setHours(0, 0, 0, 0);
      if (checkinDate === today) {
        result.day.total += 1;
      }
      if (checkinDate >= sunday && checkinDate <= satuday) {
        result.week.total += 1;
      }
      if (checkinDate >= firstDayInMonth && checkinDate <= lastDayInMonth) {
        result.month.total += 1;
      }
      result.totalTime.total += 1;
      if (
        allRequest[i].status === 'BOOKED' ||
        allRequest[i].status === 'CHECKED_IN' ||
        allRequest[i].status === 'CHECKED_OUT'
      ) {
        if (checkinDate === today) {
          result.day.booked += 1;
        }
        if (checkinDate >= sunday && checkinDate <= satuday) {
          result.week.booked += 1;
        }
        if (checkinDate >= firstDayInMonth && checkinDate <= lastDayInMonth) {
          result.month.booked += 1;
        }
        result.totalTime.booked += 1;
      } else {
        if (checkinDate === today) {
          result.day.cancelled += 1;
        }
        if (checkinDate >= sunday && checkinDate <= satuday) {
          result.week.cancelled += 1;
        }
        if (checkinDate >= firstDayInMonth && checkinDate <= lastDayInMonth) {
          result.month.cancelled += 1;
        }
        result.totalTime.cancelled += 1;
      }
    }

    return result;
  }

  async getCountRequestInWeekOfUser(id: string, date: string) {
    const SETTING_BOOKING_TIME = getConfigFileLoaded().maxBookingRequestPerWeek;
    try {
      const result = {
        usedBookingTime: 0,
        isAvailable: true,
        totalBookingTime: SETTING_BOOKING_TIME,
      };
      result.usedBookingTime = Number(
        await this.repository.getCountRequestInWeekOfUser(id, date)
      );
      if (result.usedBookingTime >= SETTING_BOOKING_TIME) {
        result.isAvailable = false;
      }
      return result;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(
        e.message || 'Error while getting booking rooms'
      );
    }
  }

  async setReasonNull(reasonId: string, queryRunner: QueryRunner) {
    try {
      const listRequest = await this.repository.getAllRequestByReason(reasonId);
      const listConvered = listRequest.map((object) => object.id);
      return this.repository.setReasonNull(listConvered, queryRunner);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(
        e.message || 'Error while getting booking rooms'
      );
    }
  }

  async isHoliday(dateStart: string, dateEnd: string) {
    try {
      return await this.holidaysService.isHoliday(dateStart, dateEnd, null);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }

  // async getBookingRooms(
  //   payload: BookingRoomsFilterRequestPayload
  // ): Promise<BookingRoomResponseDTO[]> {
  //   try {
  //     const rooms = await this.roomService.getAllWithoutPagination();
  //     const result: BookingRoomResponseDTO[] = [];
  //     let counter = 1;
  //     for (let i = 0; i < rooms.length; i++) {
  //       for (let j = 1; j <= 6; j++) {
  //         result.push({
  //           stt: counter++,
  //           roomId: rooms[i].id,
  //           roomName: rooms[i].name,
  //           slot: j,
  //         });
  //       }
  //     }
  //     console.log(payload.search);
  //     console.log(
  //       result.filter((bookingRoom) =>
  //         bookingRoom.roomName.includes(payload.search)
  //       )
  //     );
  //     return result.filter((bookingRoom) =>
  //       bookingRoom.roomName.includes(payload.search)
  //     );
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException('Error while getting booking rooms');
  //   }
  // }

  async getRequestByRoomId(roomId: string) {
    try {
      if (roomId === '') {
        throw new BadRequestException('Please type a room ID');
      }
      return await this.repository.getRequestByRoomId(roomId);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(
        e.message ||
        'An error occurred while getting request by room id ' + roomId
      );
    }
  }

  async getRequestByDeviceId(deviceId: string) {
    try {
      if (deviceId === '') {
        throw new BadRequestException('Please type a device ID');
      }
      return await this.repository.getRequestByDeviceId(deviceId);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  // async getRequestBySlotId(slotId: string) {
  //   try {
  //     if (slotId === '') {
  //       throw new BadRequestException('Please type a slot ID');
  //     }
  //     return await this.repository.getRequestBySlotId(slotId);
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  async getRequestBookingByAccountId(
    accountId: string
  ): Promise<BookingRequest[]> {
    try {
      return await this.repository.getRequestBookingByAccountId(accountId);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        'An error occurred while getting request by account id ' + accountId
      );
    }
  }

  async getDevicesUseInRequest(requestId: string): Promise<BookingRequest[]> {
    try {
      return await this.bookingRoomDeviceService.findByRequestId(requestId);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        'An error occurred while getting request by account id ' + requestId
      );
    }
  }

  async getAllBookingRoomsPagination(
    payload: BookingRoomPaginationParams,
    accountId: string
  ) {
    try {
      const role = await this.accountService.getRoleOfAccount(accountId);
      let filterByAccountId = null;
      if (role.role_name === 'Staff') {
        filterByAccountId = accountId;
      }
      const result = await this.repository.findByPaginationPayload(
        payload,
        filterByAccountId
      );
      if (
        result.meta.totalPages > 0 &&
        result.meta.currentPage > result.meta.totalPages
      ) {
        throw new BadRequestException('Current page is over');
      }

      return result;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  // getBookingRoomDevices(name: string, type: string, sort: string) {
  //   return this.deviceService.getBookingRoomDeviceList(name, type, sort);
  // }

  // async getUsernameList(): Promise<string[]> {
  //   return await this.accountService.getUsernameList();
  // }

  // async getRoomNames(): Promise<Devices[]> {
  //   return await this.roomService.getRoomNames();
  // }

  // async getChoosingBookingRooms(filter: string) {
  //   try {
  //     const payload = filter
  //       ? (JSON.parse(filter) as ChooseBookingRoomFilterPayload)
  //       : ({
  //           roomName: {
  //             name: '',
  //             sort: 'ASC',
  //           },
  //           roomType: {
  //             name: 'e6f085ec',
  //             sort: 'ASC',
  //           },
  //         } as ChooseBookingRoomFilterPayload);
  //     if (payload.roomType.name.length > 0) {
  //       const isExisted = await this.roomTypeService.existsById(
  //         payload.roomType.name
  //       );
  //       if (!isExisted) {
  //         throw new BadRequestException(
  //           'Room type does not exist with provided id'
  //         );
  //       }
  //     }
  //     return this.roomService.getRoomsFilterByNameAndType(payload);
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  async getListRequestBookedInMultiDayV2(payload: {
    dateStart: string;
    dateEnd: string;
    checkinTime: string;
    checkoutTime: string;
  }) {
    try {
      const listRequestBookedInMultiDay =
        await this.repository.getRequestBookedSameTimeMultiDate(
          payload.dateStart,
          payload.dateEnd,
          payload.checkinTime,
          payload.checkoutTime
        );
      return listRequestBookedInMultiDay;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  // async checkSlotOverTime(payload: { slotin: string; date: string }) {
  //   try {
  //     const today = dayjs(new Date()).format('YYYY-MM-DD');
  //     const currTime = dayjs(new Date()).format('HH:mm:ss');
  //     if (today === payload.date) {
  //       const slot = await this.slotService.getById(payload.slotin);
  //       if (currTime > slot.timeStart) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     } else {
  //       return false;
  //     }
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  // async getBookingByRoomInWeek(payload: { roomId: string; date: string }) {
  //   try {
  //     const result = await this.repository.getBookingByRoomInWeek(payload);
  //     return result;
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  // async getRequestPendingOfRoomInDay(
  //   roomId: string,
  //   requestId: string,
  //   date: string
  // ) {
  //   try {
  //     return this.repository.getRequestPendingOfRoomInDay(
  //       roomId,
  //       requestId,
  //       date
  //     );
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  // async getRequestPendingOfUserInDay(
  //   userId: string,
  //   requestId: string,
  //   date: string
  // ) {
  //   try {
  //     return this.repository.getRequestPendingOfUserInDay(
  //       userId,
  //       requestId,
  //       date
  //     );
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  // async getRequestOfRoomWithSameSlot(payload: {
  //   roomId: string;
  //   date: string;
  //   requestId: string;
  //   checkinSlotId: string;
  //   checkoutSlotId: string;
  // }) {
  //   try {
  //     const slotIn = await this.slotService.getNumOfSlot(payload.checkinSlotId);
  //     const slotOut = await this.slotService.getNumOfSlot(
  //       payload.checkoutSlotId
  //     );
  //     const listRequestPending = await this.getRequestPendingOfRoomInDay(
  //       payload.roomId,
  //       payload.requestId,
  //       payload.date
  //     );
  //     if (listRequestPending.length > 0) {
  //       const listResult = listRequestPending.filter((request) => {
  //         for (let j = request.slotIn; j <= request.slotOut; j++) {
  //           if (j >= slotIn.slotNum && j <= slotOut.slotNum) {
  //             return request;
  //           }
  //         }
  //       });
  //       return listResult;
  //     }
  //     return null;
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  // async getRequestOfUserWithSameSlot(payload: {
  //   userId: string;
  //   date: string;
  //   requestId: string;
  //   checkinSlotId: string;
  //   checkoutSlotId: string;
  // }) {
  //   try {
  //     const slotIn = await this.slotService.getNumOfSlot(payload.checkinSlotId);
  //     const slotOut = await this.slotService.getNumOfSlot(
  //       payload.checkoutSlotId
  //     );
  //     const listRequestPending = await this.getRequestPendingOfUserInDay(
  //       payload.userId,
  //       payload.requestId,
  //       payload.date
  //     );
  //     if (listRequestPending.length > 0) {
  //       const listResult = listRequestPending.filter((request) => {
  //         for (let j = request.slotIn; j <= request.slotOut; j++) {
  //           if (j >= slotIn.slotNum && j <= slotOut.slotNum) {
  //             return request;
  //           }
  //         }
  //       });
  //       return listResult;
  //     }
  //     return null;
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  // async getListRequestBookedInMultiDay(payload: {
  //   dateStart: string;
  //   dateEnd: string;
  //   checkinSlot: number;
  //   checkoutSlot: number;
  // }) {
  //   try {
  //     const listRequestBookedInMultiDay =
  //       await this.repository.getRequestBookedInMultiDay(
  //         payload.dateStart,
  //         payload.dateEnd
  //       );
  //     if (listRequestBookedInMultiDay.length > 0) {
  //       const listRequestBookedInMultiDayAndSlot =
  //         listRequestBookedInMultiDay.filter((request) => {
  //           for (let j = request.slotStart; j <= request.slotEnd; j++) {
  //             if (j >= payload.checkinSlot && j <= payload.checkoutSlot) {
  //               return request;
  //             }
  //           }
  //         });
  //       return listRequestBookedInMultiDayAndSlot;
  //     }
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  async getRoomFreeAtTime(payload: {
    search: string;
    date: string;
    checkinTime: string;
    checkoutTime: string;
    capacity: number;
  }) {
    try {
      const listRequestBookedSameTime =
        await this.repository.getRequestBookedSameTime(
          payload.date,
          payload.checkinTime,
          payload.checkoutTime
        );
      const listRoomBookedSameTime = [];
      if (listRequestBookedSameTime?.length > 0) {
        listRequestBookedSameTime.map((request) => {
          listRoomBookedSameTime.push(request.roomId);
        });
      }
      const result = await this.roomService.filterRoomFreeByRoomBooked(
        payload.search,
        payload.capacity,
        listRoomBookedSameTime
      );
      return result;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getRoomFreeAtMultiDateV2(payload: {
    search: string;
    dateStart: string;
    dateEnd: string;
    capacity: number;
    checkinTime: string;
    checkoutTime: string;
  }) {
    try {
      const listRequestBookedInMultiDay =
        await this.getListRequestBookedInMultiDayV2(payload);
      const listRoomBookedInMultiDaySameSlot = [];
      if (listRequestBookedInMultiDay?.length > 0) {
        listRequestBookedInMultiDay.map((request) => {
          listRoomBookedInMultiDaySameSlot.push(request.roomId);
        });
      }
      const result = await this.roomService.filterRoomFreeByRoomBooked(
        payload.search,
        payload.capacity,
        listRoomBookedInMultiDaySameSlot
      );
      return result;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  // async getRoomFreeAtMultiDate(payload: {
  //   search: string;
  //   dateStart: string;
  //   dateEnd: string;
  //   checkinSlot: number;
  //   checkoutSlot: number;
  // }) {
  //   try {
  //     const listRequestBookedInMultiDay =
  //       await this.getListRequestBookedInMultiDay(payload);
  //     const listRoomBookedInMultiDaySameSlot = [];
  //     if (listRequestBookedInMultiDay?.length > 0) {
  //       listRequestBookedInMultiDay.map((request) => {
  //         listRoomBookedInMultiDaySameSlot.push(request.roomId);
  //       });
  //     }
  //     const result = await this.roomService.filterRoomFreeByRoomBooked(
  //       payload.search,
  //       listRoomBookedInMultiDaySameSlot
  //     );
  //     return result;
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  async getCurrentRoomBookingList(accountId: string) {
    try {
      return await this.repository.findByCurrentBookingListByAccountId(
        accountId
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getInforToFeedback(id: string) {
    try {
      const user = await this.repository.getInforToFeedback(id);
      if (user) {
        return user;
      } else {
        throw new BadRequestException('Not found request with provided id');
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getBookingRoomById(id: string) {
    try {
      const requestInfo = await this.repository.findById(id);
      if (requestInfo) {
        const listDevice = await this.bookingRoomDeviceService.findByRequestId(
          id
        );

        const feedback = await this.bookingFeedbackService.isAlreadyFeedback(
          id
        );
        return {
          ...requestInfo,
          listDevice: listDevice,
          feedback: feedback,
        };
      } else {
        throw new BadRequestException('Not found request with provided id');
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async countRequestBooking(id: string) {
    try {
      const roleName = await this.accountService.getAccountRoleById(id);
      if (roleName === 'Librarian' || roleName === 'System Admin') {
        return await this.repository.countRequestBooking();
      } else if (roleName === 'Staff') {
        return await this.repository.countRequestBookingForAccountId(id);
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getRequestBookedInPast(date: string, time: string) {
    try {
      return await this.repository.getRequestBookedInPast(date, time);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async checkAlreadyHaveBookingSameSlotV2(payload: {
    checkinDate: string;
    userId: string;
    timeStart: string;
    timeEnd: string;
  }) {
    try {
      let alreadyBookedOtherRoom = '';
      const listRequestBookedAtSameTimeOfUser =
        await this.repository.getRequestBookedSameTimeOfUser(
          payload.checkinDate,
          payload.userId,
          payload.timeStart,
          payload.timeEnd
        );
      if (listRequestBookedAtSameTimeOfUser.length > 0) {
        listRequestBookedAtSameTimeOfUser.map(async (request) => {
          alreadyBookedOtherRoom +=
            request.roomName + ' in ' + payload.checkinDate;
        });
      }
      return alreadyBookedOtherRoom;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(
        e.message || 'Have some errors when check isAlreadyBookedSameSlot'
      );
    }
  }

  // async checkAlreadyHaveBookingSameSlot(payload: {
  //   checkinDate: string;
  //   userId: string;
  //   slotNumIn: number;
  //   slotNumOut: number;
  // }) {
  //   try {
  //     let alreadyBookedOtherRoom = '';
  //     const listRequestBookedInDayOfUser =
  //       await this.repository.getRequestBookedInDayOfUser(
  //         payload.checkinDate,
  //         payload.userId
  //       );
  //     if (listRequestBookedInDayOfUser.length > 0) {
  //       listRequestBookedInDayOfUser.map(async (request) => {
  //         for (let j = request.slotIn; j <= request.slotOut; j++) {
  //           if (j >= payload.slotNumIn && j <= payload.slotNumOut) {
  //             alreadyBookedOtherRoom = request.roomName;
  //             break;
  //           }
  //         }
  //       });
  //     }
  //     return alreadyBookedOtherRoom;
  //   } catch (e) {
  //     throw new BadRequestException(
  //       'Have some errors when check isAlreadyBookedSameSlot'
  //     );
  //   }
  // }

  async getListRequestInDayRange(payload: {
    dateStart: string;
    dateEnd: string;
  }) {
    try {
      const listRequestInDayRange =
        await this.repository.getListRequestInDayRange(
          payload.dateStart,
          payload.dateEnd
        );

      return listRequestInDayRange;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(
        e.message || 'Have some errors when check isAlreadyBookedSameSlot'
      );
    }
  }

  async addNewRequest(
    payload: BookingRequestAddRequestPayload,
    userId: string
  ): Promise<BookingRequest> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const role = await this.accountService.getRoleOfAccount(userId);

      const dateChoosed = new Date(payload.checkinDate).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);

      await this.roomService.findById(payload.roomId);

      if (dateChoosed < today) {
        throw new BadRequestException(
          'Are you trying to make a booking in the past? Are you crazy?'
        );
      } else if (dateChoosed === today) {
        const timeCheckin = payload.checkinTime;
        const timeNow = dayjs(new Date()).format('HH:mm:ss');

        if (timeCheckin < timeNow) {
          throw new BadRequestException('The slot you chose is now over!');
        }
      }
      if (await this.isHoliday(payload.checkinDate, payload.checkinDate)) {
        throw new BadRequestException(
          'The date you have selected is a holiday, the library will not be active. Try again another day'
        );
      }
      if (payload.checkinTime > payload.checkoutTime) {
        throw new BadRequestException(
          'Have error when booking, time start > time end'
        );
      }

      if (
        payload.bookedFor &&
        payload.bookedFor !== userId &&
        role.role_name === 'Staff'
      ) {
        throw new BadRequestException(
          'You are not authorized to make a booking for other users!'
        );
      }

      const alreadyBookedOtherRoom =
        await this.checkAlreadyHaveBookingSameSlotV2({
          checkinDate: payload.checkinDate,
          userId: payload.bookedFor || userId,
          timeStart: payload.checkinTime,
          timeEnd: payload.checkoutTime,
        });
      if (alreadyBookedOtherRoom !== '') {
        throw new BadRequestException(
          payload.bookedFor
            ? `This user have bookings for ${alreadyBookedOtherRoom} at same time!`
            : `You already have bookings for ${alreadyBookedOtherRoom} at same time!`
        );
      }
      const listRequestBookedSameTimeOfRoom =
        await this.repository.getRequestBookedSameTimeOfRoom(
          payload.checkinDate,
          payload.roomId,
          payload.checkinTime,
          payload.checkoutTime
        );

      if (listRequestBookedSameTimeOfRoom.length > 0) {
        throw new BadRequestException(
          'Already have request booked in this time, try another time'
        );
      }

      const request = await this.repository.createNewRequest(
        payload,
        userId,
        queryRunner
      );

      await this.bookingRoomDeviceService.addDeviceToRequest(
        request.id,
        payload.listDevice,
        queryRunner
      );

      if (payload.bookedFor && payload.bookedFor !== userId) {
        const roomName = await this.roomService.getRoomName(request.roomId);
        await this.notificationService.sendBookedForNotification(
          dayjs(request.checkinDate).format('DD-MM-YYYY'),
          payload.checkinTime,
          payload.checkoutTime,
          roomName.name,
          role.username,
          request.bookedFor,
          queryRunner
        );
      }

      await queryRunner.commitTransaction();

      return request;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async checkAlreadyHaveBookingSameSlotMultiDay(payload: {
    checkinDate: string;
    checkoutDate: string;
    userId: string;
    checkinTime: string;
    checkoutTime: string;
  }) {
    try {
      const fromDate = new Date(payload.checkinDate);
      const toDate = new Date(payload.checkoutDate);
      const alreadyBookedOtherRoom = [];

      for (
        let i = new Date(fromDate);
        i <= toDate;
        i.setDate(i.getDate() + 1)
      ) {
        const result = await this.checkAlreadyHaveBookingSameSlotV2({
          checkinDate: dayjs(i).format('YYYY-MM-DD'),
          userId: payload.userId,
          timeStart: payload.checkinTime,
          timeEnd: payload.checkoutTime,
        });
        if (result.length > 0) {
          alreadyBookedOtherRoom.push(
            ' ' + result + ' in ' + dayjs(i).format('DD-MM-YYYY')
          );
        }
      }

      return alreadyBookedOtherRoom;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async addMultiRequest(
    payload: BookingRequestAddRequestPayload,
    userId: string
  ): Promise<BookingRequest[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const dateChoosed = new Date(payload.checkinDate).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);

      if (dateChoosed < today) {
        throw new BadRequestException(
          'Are you trying to make a booking in the past? Are you crazy?'
        );
      } else if (dateChoosed === today) {
        const timeNow = dayjs(new Date()).format('HH:mm:ss');

        if (payload.checkinTime < timeNow) {
          throw new BadRequestException('The slot you chose is now over!');
        }
      }
      if (await this.isHoliday(payload.checkinDate, payload.checkoutDate)) {
        throw new BadRequestException(
          'One of dates you have selected is a holiday, the library will not be active. Try again another day'
        );
      }
      if (payload.checkinTime > payload.checkoutTime) {
        throw new BadRequestException(
          'Have error when booking, time start > time end'
        );
      }

      const fromDate = new Date(payload.checkinDate);
      const toDate = new Date(payload.checkoutDate);

      if (fromDate > toDate) {
        throw new BadRequestException(
          'Have error when booking, from date > to date'
        );
      }

      const alreadyBookedOtherRoom =
        await this.checkAlreadyHaveBookingSameSlotMultiDay({
          checkinDate: payload.checkinDate,
          checkoutDate: payload.checkoutDate,
          userId: payload.bookedFor || userId,
          checkinTime: payload.checkinTime,
          checkoutTime: payload.checkoutTime,
        });

      if (alreadyBookedOtherRoom.length > 0) {
        throw new BadRequestException(
          `You already have bookings for ${alreadyBookedOtherRoom} at same slot!`
        );
      }

      const listRequestPeningAndBookedInDay =
        await this.repository.getRequestBookedSameTimeMultiDateOfRoom(
          payload.checkinDate,
          payload.checkoutDate,
          payload.checkinTime,
          payload.checkoutTime,
          payload.roomId
        );

      if (listRequestPeningAndBookedInDay.length > 0) {
        throw new BadRequestException(
          'Already have request booked in this slot, try another slot'
        );
      }

      const listRequestAdded = [];

      for (
        let z = new Date(fromDate);
        z <= toDate;
        z.setDate(z.getDate() + 1)
      ) {
        const newPayload = {
          ...payload,
          checkinDate: dayjs(z).format('YYYY-MM-DD'),
        };

        const request = await this.repository.createNewRequest(
          newPayload,
          userId,
          queryRunner
        );
        listRequestAdded.push(request);
        await this.bookingRoomDeviceService.addDeviceToRequest(
          request.id,
          payload.listDevice,
          queryRunner
        );
      }

      await queryRunner.commitTransaction();

      return listRequestAdded;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async updateListDevice(
    payload: { requestId: string; listDevice: any[] },
    user: string
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const account = await this.accountService.getById(user);


    try {
      const request = await this.repository.getRequest(payload.requestId);
      if (!request) {
        throw new BadRequestException('No booking request')
      }
      await this.bookingRoomDeviceService.removeDeviceFromRequest(
        payload.requestId,
        queryRunner
      );

      await this.bookingRoomDeviceService.addDeviceToRequest(
        payload.requestId,
        payload.listDevice,
        queryRunner
      );

      await this.notificationService.updateDevicesNotification(
        request.checkinDate,
        request.checkinTime,
        request.checkoutTime,
        account.fullname,
        request.bookedFor,
        queryRunner
      )

      await queryRunner.commitTransaction();
      return request.bookedFor;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async cancelRequest(
    accountId: string,
    id: string,
    reason: string,
    queryRunner: QueryRunner
  ) {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Request does not found with the provided id'
        );
      }
      const isCancelled = await this.repository.isCancelledById(id);
      if (isCancelled) {
        throw new BadRequestException('Request already cancelled!');
      }

      const role = await this.accountService.getRoleOfAccount(accountId);
      const requestCancelled = await this.repository.cancelRoomBookingById(
        accountId,
        id,
        reason,
        role.role_name,
        queryRunner
      );

      const request = await this.repository.getRequest(id);
      await this.notificationService.sendCancelRequestNotification(
        request,
        reason,
        queryRunner
      );

      return requestCancelled;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  // async acceptById(accountId: string, id: string) {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const request = await this.repository.getRequest(id);
  //     if (!request) {
  //       throw new BadRequestException(
  //         'Request does not found with the provided id'
  //       );
  //     }
  //     const isAccepted = await this.repository.isAcceptById(id);
  //     if (isAccepted) {
  //       throw new BadRequestException('Request already accepted!');
  //     }

  //     const isCancelled = await this.repository.isCancelledById(id);
  //     if (isCancelled) {
  //       throw new BadRequestException('Request already cancelled!');
  //     }

  //     const listRequestSameSlot = await this.getRequestOfRoomWithSameSlot({
  //       roomId: request.roomId,
  //       date: dayjs(request.checkinDate).format('YYYY-MM-DD'),
  //       requestId: request.id,
  //       checkinSlotId: request.checkinSlotId,
  //       checkoutSlotId: request.checkoutSlotId,
  //     });
  //     if (listRequestSameSlot) {
  //       const reason = 'This room is given priority for another request';
  //       listRequestSameSlot.forEach(async (requestSameSlot) => {
  //         this.repository.rejectById(
  //           accountId,
  //           requestSameSlot.id,
  //           reason,
  //           queryRunner
  //         );

  //         const _receiver = await this.accountService.getRoleOfAccount(
  //           requestSameSlot.bookedForId
  //         );
  //         if (_receiver.fcmToken) {
  //           const message = {
  //             data: {
  //               score: '850',
  //               time: '2:45',
  //             },
  //             notification: {
  //               title: 'FLBRMS',
  //               body: 'Your request booking was rejected',
  //             },
  //           };
  //           await admin
  //             .messaging()
  //             .sendToDevice(_receiver.fcmToken, message)
  //             .then((response) => {
  //               console.log('Successfully sent message:', response);
  //             })
  //             .catch((error) => {
  //               console.log('Error sending message:', error);
  //             });
  //         }
  //       });
  //     }

  //     const listRequestOfUserSameSlot = await this.getRequestOfUserWithSameSlot(
  //       {
  //         userId: request.bookedFor,
  //         date: dayjs(request.checkinDate).format('YYYY-MM-DD'),
  //         requestId: request.id,
  //         checkinSlotId: request.checkinSlotId,
  //         checkoutSlotId: request.checkoutSlotId,
  //       }
  //     );
  //     if (listRequestOfUserSameSlot) {
  //       const reason =
  //         'You have been accept to request a reservation in another room at the same slot. Therefore, this request will be cancelled.';
  //       listRequestOfUserSameSlot.forEach(async (requestSameSlot) => {
  //         this.repository.rejectById(
  //           accountId,
  //           requestSameSlot.id,
  //           reason,
  //           queryRunner
  //         );

  //         const _receiver = await this.accountService.getRoleOfAccount(
  //           requestSameSlot.bookedForId
  //         );
  //         if (_receiver.fcmToken) {
  //           const message = {
  //             data: {
  //               score: '850',
  //               time: '2:45',
  //             },
  //             notification: {
  //               title: 'FLBRMS',
  //               body: 'Your request booking was rejected',
  //             },
  //           };
  //           await admin
  //             .messaging()
  //             .sendToDevice(_receiver.fcmToken, message)
  //             .then((response) => {
  //               console.log('Successfully sent message:', response);
  //             })
  //             .catch((error) => {
  //               console.log('Error sending message:', error);
  //             });
  //         }
  //       });
  //     }

  //     const requestAccepted = await this.repository.acceptById(
  //       accountId,
  //       id,
  //       queryRunner
  //     );

  //     await this.notificationService.sendAcceptRequestNotification(
  //       dayjs(request.checkinDate).format('DD-MM-YYYY'),
  //       request.checkinSlotName,
  //       request.checkoutSlotName,
  //       request.roomName,
  //       request.requestedBy,
  //       queryRunner
  //     );

  //     await queryRunner.commitTransaction();
  //     return requestAccepted;
  //   } catch (e) {
  //     this.logger.error(e);
  //     await queryRunner.rollbackTransaction();
  //     throw new BadRequestException(
  //       e.message ?? 'Error occurred while accept request'
  //     );
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async reject(
  //   accountId: string,
  //   id: string,
  //   reason: string,
  //   queryRunner: QueryRunner
  // ) {
  //   try {
  //     const requestRejected = await this.repository.rejectById(
  //       accountId,
  //       id,
  //       reason,
  //       queryRunner
  //     );

  //     const request = await this.repository.getRequest(id);
  //     await this.notificationService.sendRejectRequestNotification(
  //       dayjs(request.checkinDate).format('DD-MM-YYYY'),
  //       request.checkinSlotName,
  //       request.checkoutSlotName,
  //       request.roomName,
  //       reason,
  //       request.requestedBy,
  //       queryRunner
  //     );

  //     return requestRejected;
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new BadRequestException(
  //       e.message ?? 'Error occurred while reject request'
  //     );
  //   }
  // }

  // async rejectById(accountId: string, id: string, reason: string) {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const isExisted = await this.repository.existsById(id);
  //     if (!isExisted) {
  //       throw new BadRequestException(
  //         'Request does not found with the provided id'
  //       );
  //     }
  //     const isAccepted = await this.repository.isAcceptById(id);
  //     if (isAccepted) {
  //       throw new BadRequestException('Request already accepted!');
  //     }

  //     const isCancelled = await this.repository.isCancelledById(id);
  //     if (isCancelled) {
  //       throw new BadRequestException('Request already cancelled!');
  //     }
  //     const requestRejected = await this.reject(
  //       accountId,
  //       id,
  //       reason,
  //       queryRunner
  //     );

  //     await queryRunner.commitTransaction();
  //     return requestRejected;
  //   } catch (e) {
  //     this.logger.error(e);
  //     await queryRunner.rollbackTransaction();

  //     throw new BadRequestException(
  //       e.message ?? 'Error occurred while reject request'
  //     );
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async cancelRoomBookingById(accountId: string, id: string, reason: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const request = await this.cancelRequest(
        accountId,
        id,
        reason,
        queryRunner
      );

      await queryRunner.commitTransaction();
      return request;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllBookingRoomsRequestsByFilter(
    accountId: string,
    filters: GetAllBookingRequestsFilter
  ) {
    try {
      const roleName = await this.accountService.getAccountRoleById(accountId);
      if (roleName === 'System Admin' || roleName === 'Librarian') {
        return await this.repository.findBookingRequestsByFilter(
          filters,
          undefined
        );
      } else {
        return await this.repository.findBookingRequestsByFilter(
          filters,
          accountId
        );
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getCurrentBookingCheckoutInformation(accountId: string) {
    try {
      const requestInfo = await this.repository.findCurrentCheckoutInformation(
        accountId
      );
      if (requestInfo) {
        const listDevice = await this.bookingRoomDeviceService.findByRequestId(
          requestInfo.id
        );
        return {
          ...requestInfo,
          listDevice: listDevice,
        };
      } else {
        throw new BadRequestException('Not found request with provided id');
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async checkOutBookingRoom(bookingRequestId: string, accountId: string) {
    try {
      return await this.repository.checkoutBookingRoom(
        bookingRequestId,
        accountId
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getAllBookingRoomHistory(
    accountId: string,
    filters: GetAllBookingRequestsFilter
  ) {
    return await this.repository.findBookingRoomHistory(accountId, filters);
  }

  async getCurrentBookingCheckin(accountId: string) {
    return await this.repository.findCurrentCheckinInformation(accountId);
  }

  async attemptCheckin(
    accountId: string,
    bookingRequestId: string,
    checkinSignature: { signature: string }
  ) {
    try {
      await this.repository.attemptCheckinBookingRoom(
        accountId,
        bookingRequestId,
        checkinSignature.signature
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async attemptCheckout(
    accountId: string,
    bookingRequestId: string,
    checkinSignature: { signature: string }
  ) {
    try {
      await this.repository.attemptCheckoutBookingRoom(
        accountId,
        bookingRequestId,
        checkinSignature.signature
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async acceptCheckinById(accountId: string, id: string) {
    try {
      await this.repository.acceptCheckinById(accountId, id);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async acceptCheckoutById(accountId: string, id: string) {
    try {
      await this.repository.acceptCheckoutById(accountId, id);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  // async rejectCheckinById(accountId: string, id: string, reason: string) {
  //   try {
  //     await this.repository.rejectCheckinById(accountId, id);
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  async bookingRoomAutomatically(
    payload: AutoRoomBookingRequestPayload,
    userId: string
  ): Promise<AutoRoomBookingResponsePayload[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const result: AutoRoomBookingResponsePayload[] = [];
      //start
      await this.validateBookingReason(payload.bookingReasonId);
      await queryRunner.startTransaction();

      for (const request of payload.bookingRequests) {
        //validation
        await this.validateAutoBookingRequest(request, userId);
        const room = await this.findRoomExistedWithProvidedCapacity(
          request.capacity, request.date, request.timeStart, request.timeEnd
        );

        const bookingRequestResponse = await this.repository.createNewRequest(
          {
            roomId: room.id,
            bookingReasonId: payload.bookingReasonId,
            checkinTime: request.timeStart,
            checkinDate: request.date,
            checkoutTime: request.timeEnd,
            checkoutDate: undefined,
            description: payload.description,
            listDevice: undefined,
            bookedFor: undefined,
          },
          userId,
          queryRunner
        );

        if (request.devices && request.devices.length > 0) {
          await this.bookingRoomDeviceService.addDeviceToRequest(
            bookingRequestResponse.id,
            request.devices.map((d) => {
              return {value: d.id, quantity: d.quantity};
            }),
            queryRunner
          );
        }

        const bookingReasonName = await this.bookingReasonService.getNameById(
          payload.bookingReasonId
        );

        result.push({
          id: bookingRequestResponse.id,
          capacity: request.capacity,
          roomName: room.roomName,
          roomType: room.roomType,
          description: payload.description,
          date: request.date,
          checkinAt: request.timeStart,
          checkoutAt: request.timeEnd,
          bookingReason: bookingReasonName,
        });
      }

      //end
      await queryRunner.commitTransaction();

      return result;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  // async rejectCheckoutById(accountId: string, id: string, reason: string) {
  //   try {
  //     await this.repository.rejectCheckoutById(accountId, id);
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  private getExampleStatistics() {
    return {
      totalTime: {
        total: 0,
        booked: 0,
        cancelled: 0,
      },
      month: {
        total: 0,
        booked: 0,
        cancelled: 0,
      },
      week: {
        total: 0,
        booked: 0,
        cancelled: 0,
      },
      day: {
        total: 0,
        booked: 0,
        cancelled: 0,
      },
    };
  }

  private async findRoomExistedWithProvidedCapacity(capacity: number, date: string, checkInAt: string, checkOutAt: string): Promise<{
    id: string;
    roomName: string;
    roomType: string;
    capacity: number;
  }> {
    const occupiedRoomIds = await this.roomService.getOccupiedRoomsAtDateTime(date, checkInAt, checkOutAt);

    const room = await this.roomService.findRoomIdAndCapacityByBetweenCapacity(
      capacity, occupiedRoomIds
    );
    if (!room) {
      throw new BadRequestException(
        'No suitable room found within the provided capacity. Please try again.'
      );
    }
    return room;
  }

  private async validateAutoBookingRequest(
    request: AutoRoomBookingRequest,
    userId: string
  ) {
    await this.validateDevices(request.devices);
    await this.validateBookingDateTime(request.date, {
      start: request.timeStart,
      end: request.timeEnd,
    });
    await this.validateConflictBookingTime(
      request.date,
      {
        start: request.timeStart,
        end: request.timeEnd,
      },
      userId
    );
  }

  private async validateConflictBookingTime(
    date: string,
    time: { start: string; end: string },
    userId: string
  ) {
    //fix bug
    const isConflicted = await this.repository.isConflictWithStartEndDateTime(
      date,
      time.start,
      time.end,
      userId
    );
    if (isConflicted) {
      throw new BadRequestException(
        `The booking request with time from ${time.start} to ${time.end} is conflict. Please choose another time.`
      );
    }
  }

  private async validateBookingDateTime(
    date: string,
    time: { start: string; end: string }
  ): Promise<void> {
    if (
      !time.start.match(BookingRoomService.REGEX_24_HOUR) ||
      !time.end.match(BookingRoomService.REGEX_24_HOUR)
    ) {
      throw new BadRequestException(
        'Time start or time end does not comply with 24-hour format. Please try again.'
      );
    }

    const currentDateTime = dayjs(dayjs().format('YYYY-MM-DD HH:mm'), {
      format: 'YYYY-MM-DD HH:mm',
    });

    const bookingDateWithTimeStart = dayjs(`${date} ${time.start}`, {
      format: 'YYYY-MM-DD HH:mm',
    });
    const bookingDateWithTimeEnd = dayjs(`${date} ${time.end}`, {
      format: 'YYYY-MM-DD HH:mm',
    });

    if (
      bookingDateWithTimeStart.isSame(bookingDateWithTimeEnd) ||
      bookingDateWithTimeStart.isAfter(bookingDateWithTimeEnd)
    ) {
      throw new BadRequestException(
        'Booking start time must not be the same or after the end time.'
      );
    }

    if (
      bookingDateWithTimeStart.isSame(currentDateTime) ||
      bookingDateWithTimeStart.isBefore(currentDateTime)
    ) {
      throw new BadRequestException(
        'Booking date time must not be the same or before with the current time.'
      );
    }
  }

  private async validateBookingReason(bookingReasonId: string): Promise<void> {
    const isExisted = await this.bookingReasonService.existsById(
      bookingReasonId
    );
    if (!isExisted) {
      throw new BadRequestException(
        `Booking reason does not exist with id: ${bookingReasonId}`
      );
    }
  }

  private async validateDevices(
    devices: AutoRoomBookingDevice[]
  ): Promise<void> {
    if (!devices || devices.length < 1) {
      return;
    }
    const deviceIds = devices.map((d) => d.id);
    if (new Set(deviceIds).size !== deviceIds.length) {
      throw new BadRequestException(
        'Ids of devices are not unique. Please try again.'
      );
    }

    const validatedDeviceIds = await this.devicesService.findIdsByGivenIds(
      deviceIds
    );

    if (validatedDeviceIds.length !== deviceIds.length) {
      const notFoundIds = deviceIds.filter(
        (id) => !validatedDeviceIds.includes(id)
      );
      throw new BadRequestException(
        `The following devices does not exist with ids: [${notFoundIds}]`
      );
    }
  }
}
