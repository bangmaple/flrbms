import { Brackets, QueryRunner, Repository } from 'typeorm';
import {
  Accounts,
  BookingRequest,
  BookingRequestDevices,
  Rooms,
  RoomType,
} from '../models';
import { CustomRepository } from '../decorators/typeorm-ex.decorator';
import { BookingRoomStatus } from '../enum/booking-room-status.enum';
import { IPaginationMeta, paginateRaw } from 'nestjs-typeorm-paginate';
import { Slot } from '../models/slot.entity';
import { BookingRequestAddRequestPayload } from '../payload/request/booking-request-add.payload';
import { BookingReason } from '../models/booking-reason.entity';
import { BadRequestException } from '@nestjs/common';
import { GetAllBookingRequestsFilter } from '../payload/request/get-all-booking-rooms-filter.payload';
import { BookingRoomPaginationParams } from '../dto/booking-room-pagination.dto';

@CustomRepository(BookingRequest)
export class BookingRoomRepository extends Repository<BookingRequest> {
  async findByBookingStatus(status: BookingRoomStatus, next5Mins: Date) {
    return this.createQueryBuilder('booking_request')
      .where('booking_request.status = :status', { status: status })
      .andWhere('booking_request.requested_at < :time', { time: next5Mins })
      .getMany();
  }

  getAllRequest() {
    return this.createQueryBuilder('booking_request')
      .select('booking_request.checkin_Date', 'checkinDate')
      .addSelect('booking_request.id', 'id')
      .addSelect('booking_request.room_id', 'roomId')
      .addSelect('booking_request.status', 'status')
      .where(
        `booking_request.status IN ('BOOKED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED')`
      )
      .orderBy('booking_request.checkin_date', 'ASC')
      .getRawMany();
  }

  getAllRequestByReason(reasonId: string) {
    return this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .where(`booking_request.booking_reason_id = :reasonId`, {
        reasonId: reasonId,
      })
      .getRawMany();
  }

  async setReasonNull(listRequestId: string[], queryRunner: QueryRunner) {
    return queryRunner.manager.update(BookingRequest, listRequestId, {
      bookingReasonId: null,
    });
  }

  getRequest(id: string) {
    return this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('r.name', 'roomName')
      .addSelect('booking_request.checkin_Date', 'checkinDate')
      .addSelect('booking_request.roomId', 'roomId')
      .addSelect('booking_request.requested_by', 'requestedBy')
      .addSelect('booking_request.booked_for', 'bookedFor')
      .addSelect('booking_request.checkinTime', 'checkinTime')
      .addSelect('booking_request.checkoutTime', 'checkoutTime')
      .addSelect('booking_request.status', 'status')
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .where('booking_request.id = :id', { id: id })
      .getRawOne();
  }

  getCountRequestInWeekOfUser(id: string, date: string) {
    const curr = new Date(date);
    const firstDay = curr.getDate() - curr.getDay() + 1;

    const sunday = new Date(new Date(date).setDate(firstDay));
    const saturday = new Date(new Date(sunday).setDate(sunday.getDate() + 6));

    return this.createQueryBuilder('booking_request')
      .select('COUNT(1)', 'count')
      .where('booking_request.requested_by = :id', { id: id })
      .andWhere('booking_request.checkin_date >= :sunday', {
        sunday: sunday,
      })
      .andWhere('booking_request.checkin_date <= :saturday', {
        saturday: saturday,
      })
      .andWhere(`booking_request.status NOT LIKE 'CANCELLED'`)
      .getRawOne()
      .then((data) => data?.count);
  }

  findByPaginationPayload(payload: BookingRoomPaginationParams, accountId) {
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.checkin_Date', 'checkinDate')
      .addSelect('booking_request.room_id', 'roomId')
      .addSelect('r.name', 'roomName')
      .addSelect('r.description', 'roomDescription')
      .addSelect('booking_request.booking_reason_id', 'reasonType')
      .addSelect('booking_request.status', 'status')
      .addSelect('booking_request.requested_at', 'bookedAt')
      .addSelect('a.username', 'requestedBy')
      .addSelect('booking_request.checkin_date', 'checkinDate')
      .addSelect('booking_request.id', 'id')
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .innerJoin(Accounts, 'a', 'a.id = booking_request.requested_by')
      .where('booking_request.status LIKE :status', {
        status: `%${payload.status}%`,
      })
      .andWhere('(r.name ILIKE :search OR a.username ILIKE :search)', {
        search: `%${payload.search}%`,
      })
      .orderBy(payload.sort, payload.dir as 'ASC' | 'DESC');
    if (payload.checkInAt && payload.checkInAt !== '') {
      query.andWhere('booking_request.checkedin_at >= :checkInAt', {
        checkInAt: payload.checkInAt,
      });
    }
    if (payload.checkInDate && payload.checkInDate !== '') {
      query.andWhere('booking_request.checkin_date >= :checkinDate', {
        checkinDate: payload.checkInDate,
      });
    }
    if (payload.reasonType && payload.reasonType !== '') {
      query.andWhere('booking_request.booking_reason_id = :reason', {
        reason: payload.reasonType,
      });
    }
    if (accountId) {
      // query.andWhere('booking_request.requested_by = :accountId', {
      //   accountId: accountId,
      // });

      query.andWhere('booking_request.booked_for = :accountId', {
        accountId: accountId,
      });
    }
    return paginateRaw<BookingRequest, IPaginationMeta>(query, {
      page: payload.page,
      limit: payload.limit,
    });
  }

  getBookingByRoomInWeek(payload: { roomId: string; date: string }) {
    const curr = new Date(payload.date);
    const firstDay = curr.getDate() - curr.getDay() + 1;

    const sunday = new Date(new Date(payload.date).setDate(firstDay));
    const saturday = new Date(new Date(sunday).setDate(sunday.getDate() + 6));
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('booking_request.checkin_Date', 'checkinDate')
      .addSelect('booking_request.room_id', 'roomId')
      .addSelect('booking_request.status', 'status')
      .addSelect('booking_request.checkin_slot', 'checkinSlot')
      .addSelect('booking_request.checkout_slot', 'checkoutSlot')
      .addSelect('slot_in.slot_num', 'slotIn')
      .addSelect('slot_out.slot_num', 'slotOut')
      .innerJoin(Slot, 'slot_in', 'slot_in.id = booking_request.checkin_slot')
      .innerJoin(
        Slot,
        'slot_out',
        'slot_out.id = booking_request.checkout_slot'
      )
      .andWhere('booking_request.room_id = :roomId', { roomId: payload.roomId })
      .andWhere(
        "(booking_request.status = 'PENDING' OR booking_request.status = 'BOOKED')"
      );
    // .andWhere("booking_request.status LIKE 'PENDING'");
    if (payload.date && payload.date !== '') {
      query.andWhere('booking_request.checkin_date >= :sunday', {
        sunday: sunday,
      });
      query.andWhere('booking_request.checkin_date <= :saturday', {
        saturday: saturday,
      });
    }
    return query.getRawMany<BookingRequest>();
  }

  getRequestBookedInPast(date: string, time: string) {
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .where('booking_request.checkin_date <= :date', { date })
      .andWhere('booking_request.checkout_time < :time', { time })
      .andWhere("booking_request.status = 'BOOKED'");
    return query.getRawMany<BookingRequest>();
  }

  // getRequestPendingOfRoomInDay(
  //   roomId: string,
  //   requestId: string,
  //   date: string
  // ): Promise<
  //   {
  //     id: string;
  //     slotIn: number;
  //     slotOut: number;
  //     status: string;
  //     bookedFor: string;
  //     bookedForId: string;
  //   }[]
  // > {
  //   const query = this.createQueryBuilder('booking_request')
  //     .select('booking_request.id', 'id')
  //     .addSelect('slot_in.slot_num', 'slotIn')
  //     .addSelect('slot_out.slot_num', 'slotOut')
  //     .addSelect('slot_in.name', 'slotInName')
  //     .addSelect('slot_out.name', 'slotOutName')
  //     .addSelect('a.username', 'requestedBy')
  //     .addSelect('aa.username', 'bookedFor')
  //     .addSelect('booking_request.booked_for', 'bookedForId')
  //     .addSelect('r.name', 'reason')
  //     .addSelect('booking_request.status', 'status')
  //     .innerJoin(Slot, 'slot_in', 'slot_in.id = booking_request.checkin_slot')
  //     .innerJoin(Accounts, 'a', 'a.id = booking_request.requested_by')
  //     .innerJoin(Accounts, 'aa', 'aa.id = booking_request.booked_for')
  //     .innerJoin(BookingReason, 'r', 'r.id = booking_request.booking_reason_id')
  //     .innerJoin(
  //       Slot,
  //       'slot_out',
  //       'slot_out.id = booking_request.checkout_slot'
  //     )
  //     .where('booking_request.checkinDate = :checkinDate', {
  //       checkinDate: date,
  //     })
  //     .andWhere('booking_request.room_id = :roomId', {
  //       roomId: roomId,
  //     })
  //     .andWhere('booking_request.id != :id', {
  //       id: requestId,
  //     })
  //     .andWhere("(booking_request.status = 'PENDING')");
  //   return query.getRawMany<{
  //     id: string;
  //     slotIn: number;
  //     slotOut: number;
  //     status: string;
  //     bookedFor: string;
  //     bookedForId: string;
  //   }>();
  // }

  // getRequestPendingOfUserInDay(
  //   userId: string,
  //   requestId: string,
  //   date: string
  // ): Promise<
  //   {
  //     id: string;
  //     slotIn: number;
  //     slotOut: number;
  //     status: string;
  //     bookedFor: string;
  //     bookedForId: string;
  //   }[]
  // > {
  //   const query = this.createQueryBuilder('booking_request')
  //     .select('booking_request.id', 'id')
  //     .addSelect('slot_in.slot_num', 'slotIn')
  //     .addSelect('slot_out.slot_num', 'slotOut')
  //     .addSelect('slot_in.name', 'slotInName')
  //     .addSelect('slot_out.name', 'slotOutName')
  //     .addSelect('a.username', 'requestedBy')
  //     .addSelect('aa.username', 'bookedFor')
  //     .addSelect('booking_request.booked_for', 'bookedForId')
  //     .addSelect('r.name', 'reason')
  //     .addSelect('booking_request.status', 'status')
  //     .innerJoin(Slot, 'slot_in', 'slot_in.id = booking_request.checkin_slot')
  //     .innerJoin(Accounts, 'a', 'a.id = booking_request.requested_by')
  //     .innerJoin(Accounts, 'aa', 'aa.id = booking_request.booked_for')
  //     .innerJoin(BookingReason, 'r', 'r.id = booking_request.booking_reason_id')
  //     .innerJoin(
  //       Slot,
  //       'slot_out',
  //       'slot_out.id = booking_request.checkout_slot'
  //     )
  //     .where('booking_request.checkinDate = :checkinDate', {
  //       checkinDate: date,
  //     })
  //     .andWhere('booking_request.booked_for = :userId', {
  //       userId: userId,
  //     })
  //     .andWhere('booking_request.id != :id', {
  //       id: requestId,
  //     })
  //     .andWhere("(booking_request.status = 'PENDING')");
  //   return query.getRawMany<{
  //     id: string;
  //     slotIn: number;
  //     slotOut: number;
  //     status: string;
  //     bookedFor: string;
  //     bookedForId: string;
  //   }>();
  // }

  // getAllRequestPending(): Promise<
  //   {
  //     id: string;
  //     requestedAt: string;
  //   }[]
  // > {
  //   return this.createQueryBuilder('booking_request')
  //     .select('booking_request.id', 'id')
  //     .addSelect('booking_request.requested_at', 'requestedAt')
  //     .andWhere("(booking_request.status = 'PENDING')")
  //     .getRawMany<{
  //       id: string;
  //       requestedAt: string;
  //     }>();
  // }

  getRequestBookedSameTime(
    date: string,
    timeStart: string,
    timeEnd: string
  ): Promise<
    {
      id: string;
      roomId: string;
      timeStart: string;
      timeEnd: string;
      status: string;
    }[]
  > {
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('booking_request.checkin_time', 'timeStart')
      .addSelect('booking_request.checkout_time', 'timeEnd')
      .addSelect('r.id', 'roomId')
      .addSelect('booking_request.status', 'status')
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .where('booking_request.checkinDate = :checkinDate', {
        checkinDate: date,
      })
      .andWhere(
        '((booking_request.checkin_time <= :timeStart AND booking_request.checkout_time > :timeStart) OR (booking_request.checkin_time < :timeEnd AND booking_request.checkout_time >= :timeEnd) OR (booking_request.checkin_time > :timeStart AND booking_request.checkin_time < :timeEnd))',
        { timeStart: timeStart, timeEnd: timeEnd }
      )
      .andWhere("booking_request.status = 'BOOKED'");
    return query.getRawMany<{
      id: string;
      roomId: string;
      timeStart: string;
      timeEnd: string;
      status: string;
    }>();
  }

  getListRequestInDayRange(
    dateStart: string,
    dateEnd: string
  ): Promise<
    {
      id: string;
      roomName: string;
      timeStart: string;
      timeEnd: string;
      status: string;
    }[]
  > {
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('booking_request.checkin_date', 'timeStart')
      .addSelect('booking_request.checkout_time', 'timeEnd')
      .addSelect('a.username', 'bookedFor')
      .addSelect('r.name', 'roomName')
      .addSelect('booking_request.status', 'status')
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .innerJoin(Accounts, 'a', 'a.id = booking_request.booked_for')
      .where(
        'booking_request.checkin_date >= :dateStart AND booking_request.checkin_date <= :dateEnd',
        {
          dateStart,
          dateEnd,
        }
      )
      .andWhere("booking_request.status = 'BOOKED'");
    return query.getRawMany<{
      id: string;
      roomName: string;
      timeStart: string;
      timeEnd: string;
      status: string;
    }>();
  }

  getRequestBookedSameTimeOfUser(
    date: string,
    userId: string,
    timeStart: string,
    timeEnd: string
  ): Promise<
    {
      id: string;
      roomName: string;
      timeStart: string;
      timeEnd: string;
      status: string;
    }[]
  > {
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('booking_request.checkin_time', 'timeStart')
      .addSelect('booking_request.checkout_time', 'timeEnd')
      .addSelect('booking_request.booked_for', 'bookedFor')
      .addSelect('r.name', 'roomName')
      .addSelect('booking_request.status', 'status')
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .where('booking_request.checkinDate = :checkinDate', {
        checkinDate: date,
      })
      .andWhere('booking_request.booked_for = :userId', {
        userId: userId,
      })
      .andWhere(
        '((booking_request.checkin_time <= :timeStart AND booking_request.checkout_time > :timeStart) OR (booking_request.checkin_time < :timeEnd AND booking_request.checkout_time >= :timeEnd) OR (booking_request.checkin_time > :timeStart AND booking_request.checkin_time < :timeEnd))',
        { timeStart: timeStart, timeEnd: timeEnd }
      )
      .andWhere("booking_request.status = 'BOOKED'");
    return query.getRawMany<{
      id: string;
      roomName: string;
      timeStart: string;
      timeEnd: string;
      status: string;
    }>();
  }

  getRequestBookedSameTimeOfRoom(
    date: string,
    roomId: string,
    timeStart: string,
    timeEnd: string
  ): Promise<
    {
      id: string;
      roomId: string;
      timeStart: string;
      timeEnd: string;
      status: string;
    }[]
  > {
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('booking_request.checkin_time', 'timeStart')
      .addSelect('booking_request.checkout_time', 'timeEnd')
      .addSelect('r.id', 'roomId')
      .addSelect('booking_request.status', 'status')
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .where('booking_request.checkinDate = :checkinDate', {
        checkinDate: date,
      })
      .andWhere(
        '((booking_request.checkin_time <= :timeStart AND booking_request.checkout_time > :timeStart) OR (booking_request.checkin_time < :timeEnd AND booking_request.checkout_time >= :timeEnd) OR (booking_request.checkin_time > :timeStart AND booking_request.checkin_time < :timeEnd))',
        { timeStart: timeStart, timeEnd: timeEnd }
      )
      .andWhere("booking_request.status = 'BOOKED'")
      .andWhere('booking_request.room_id = :roomId', { roomId: roomId });
    return query.getRawMany<{
      id: string;
      roomId: string;
      timeStart: string;
      timeEnd: string;
      status: string;
    }>();
  }

  getRequestBookedSameTimeMultiDate(
    dateStart: string,
    dateEnd: string,
    timeStart: string,
    timeEnd: string
  ): Promise<
    {
      id: string;
      roomId: string;
      timeStart: string;
      timeEnd: string;
      status: string;
    }[]
  > {
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('booking_request.checkin_time', 'timeStart')
      .addSelect('booking_request.checkout_time', 'timeEnd')
      .addSelect('r.id', 'roomId')
      .addSelect('booking_request.status', 'status')
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .where(
        '(booking_request.checkinDate >= :dateStart AND booking_request.checkinDate <= :dateEnd)',
        {
          dateStart: dateStart,
          dateEnd: dateEnd,
        }
      )
      .andWhere(
        '((booking_request.checkin_time <= :timeStart AND booking_request.checkout_time > :timeStart) OR (booking_request.checkin_time < :timeEnd AND booking_request.checkout_time >= :timeEnd) OR (booking_request.checkin_time > :timeStart AND booking_request.checkin_time < :timeEnd))',
        { timeStart: timeStart, timeEnd: timeEnd }
      )
      .andWhere("booking_request.status = 'BOOKED'");
    return query.getRawMany<{
      id: string;
      roomId: string;
      timeStart: string;
      timeEnd: string;
      status: string;
    }>();
  }

  getRequestBookedSameTimeMultiDateOfRoom(
    dateStart: string,
    dateEnd: string,
    timeStart: string,
    timeEnd: string,
    roomId
  ): Promise<
    {
      id: string;
      roomId: string;
      timeStart: string;
      timeEnd: string;
      status: string;
    }[]
  > {
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('booking_request.checkin_time', 'timeStart')
      .addSelect('booking_request.checkout_time', 'timeEnd')
      .addSelect('r.id', 'roomId')
      .addSelect('booking_request.status', 'status')
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .where(
        '(booking_request.checkinDate >= :dateStart AND booking_request.checkinDate <= :dateEnd)',
        {
          dateStart: dateStart,
          dateEnd: dateEnd,
        }
      )
      .andWhere(
        '((booking_request.checkin_time <= :timeStart AND booking_request.checkout_time > :timeStart) OR (booking_request.checkin_time < :timeEnd AND booking_request.checkout_time >= :timeEnd) OR (booking_request.checkin_time > :timeStart AND booking_request.checkin_time < :timeEnd))',
        { timeStart: timeStart, timeEnd: timeEnd }
      )
      .andWhere("booking_request.status = 'BOOKED'")
      .andWhere('booking_request.room_id = :roomId', { roomId: roomId });
    return query.getRawMany<{
      id: string;
      roomId: string;
      timeStart: string;
      timeEnd: string;
      status: string;
    }>();
  }

  // getRequestBookedInMultiDay(
  //   dateStart: string,
  //   dateEnd: string
  // ): Promise<
  //   {
  //     id: string;
  //     roomId: string;
  //     roomName: string;
  //     slotStart: number;
  //     slotEnd: number;
  //   }[]
  // > {
  //   return this.createQueryBuilder('booking_request')
  //     .select('booking_request.id', 'id')
  //     .addSelect('booking_request.room_id', 'roomId')
  //     .addSelect('r.name', 'roomName')
  //     .addSelect('slot_start.slot_num', 'slotStart')
  //     .addSelect('slot_end.slot_num', 'slotEnd')
  //     .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
  //     .innerJoin(
  //       Slot,
  //       'slot_start',
  //       'slot_start.id = booking_request.checkin_slot'
  //     )
  //     .innerJoin(
  //       Slot,
  //       'slot_end',
  //       'slot_end.id = booking_request.checkout_slot'
  //     )
  //     .where('booking_request.checkinDate >= :dateStart', {
  //       dateStart: dateStart,
  //     })
  //     .where('booking_request.checkinDate <= :dateEnd', {
  //       dateEnd: dateEnd,
  //     })
  //     .andWhere("(booking_request.status = 'BOOKED')")
  //     .getRawMany<{
  //       id: string;
  //       roomId: string;
  //       roomName: string;
  //       slotStart: number;
  //       slotEnd: number;
  //     }>();
  // }

  getBookingPendingAndBookedInDay(
    date: string,
    roomId: string
  ): Promise<
    {
      id: string;
      slotIn: number;
      slotOut: number;
      status: string;
    }[]
  > {
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('slot_in.slot_num', 'slotIn')
      .addSelect('slot_out.slot_num', 'slotOut')
      .addSelect('booking_request.status', 'status')
      .innerJoin(Slot, 'slot_in', 'slot_in.id = booking_request.checkin_slot')
      .innerJoin(
        Slot,
        'slot_out',
        'slot_out.id = booking_request.checkout_slot'
      )
      .where('booking_request.checkinDate = :checkinDate', {
        checkinDate: date,
      })
      .andWhere('booking_request.room_id = :roomId', {
        roomId: roomId,
      })
      .andWhere(
        "(booking_request.status = 'PENDING' OR booking_request.status = 'BOOKED')"
      );
    return query.getRawMany<{
      id: string;
      slotIn: number;
      slotOut: number;
      status: string;
    }>();
  }

  getBookingPendingAndBookedInMultiDay(
    dateStart: string,
    dateEnd: string,
    roomId: string
  ): Promise<
    {
      id: string;
      slotIn: number;
      slotOut: number;
      status: string;
    }[]
  > {
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('slot_in.slot_num', 'slotIn')
      .addSelect('slot_out.slot_num', 'slotOut')
      .addSelect('booking_request.status', 'status')
      .innerJoin(Slot, 'slot_in', 'slot_in.id = booking_request.checkin_slot')
      .innerJoin(
        Slot,
        'slot_out',
        'slot_out.id = booking_request.checkout_slot'
      )
      .where('booking_request.checkinDate >= :dateStart', {
        dateStart: dateStart,
      })
      .andWhere('booking_request.checkinDate <= :dateEnd', {
        dateEnd: dateEnd,
      })
      .andWhere('booking_request.room_id = :roomId', {
        roomId: roomId,
      })
      .andWhere(
        "(booking_request.status = 'PENDING' OR booking_request.status = 'BOOKED')"
      );
    return query.getRawMany<{
      id: string;
      slotIn: number;
      slotOut: number;
      status: string;
    }>();
  }

  findByCurrentBookingListByAccountId(
    accountId: string
  ): Promise<BookingRequest[]> {
    return this.createQueryBuilder('booking_request')
      .select('booking_request.checkin_date', 'checkinDate')
      .addSelect('booking_request.requested_at', 'bookedAt')
      .addSelect('booking_request.status', 'status')
      .addSelect('r.name', 'roomName')
      .addSelect('s.slot_num', 'checkinSlotNum')
      .addSelect('ss.slot_num', 'checkoutSlotNum')
      .addSelect('booking_request.id', 'id')
      .addSelect('booking_request.requested_at', 'requestedAt')
      .addSelect('booking_request.checkedin_at', 'checkinAt')
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .innerJoin(Slot, 's', 's.id = booking_request.checkin_slot')
      .innerJoin(Slot, 'ss', 'ss.id = booking_request.checkout_slot')
      .where('booking_request.requested_by = :accountId', {
        accountId: accountId,
      })
      .andWhere(`booking_request.status IN ('BOOKING', 'BOOKED', 'CHECKED_IN')`)
      .getRawMany<BookingRequest>();
  }

  // findByIdAndAccountId(accountId: string, id: string): Promise<BookingRequest> {
  //   return this.createQueryBuilder('booking_request')
  //     .select('booking_request.id', 'id')
  //     .addSelect('booking_request.status', 'status')
  //     .addSelect('booking_request.checkin_Date', 'checkinDate')
  //     .addSelect('booking_request.booking_reason_id', 'reasonType')
  //     .addSelect('booking_request.description', 'description')
  //     .addSelect('booking_request.requested_at', 'requestedAt')
  //     .addSelect('booking_request.requested_by', 'requestedBy')
  //     .addSelect('booking_request.updated_at', 'updatedAt')
  //     .addSelect('booking_request.requested_at', 'bookedAt')
  //     .addSelect('r.type', 'roomType')
  //     .addSelect('r.id', 'roomId')
  //     .addSelect('r.name', 'roomName')
  //     .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
  //     .innerJoin(Accounts, 'a', 'a.id = booking_request.requested_by')
  //     .where('booking_request.requested_by = :accountId', {
  //       accountId: accountId,
  //     })
  //     .andWhere('booking_request.id = :id', { id: id })
  //     .getRawOne<BookingRequest>();
  // }

  getRequestByRoomId(roomId: string) {
    const date = new Date();
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('booking_request.checkin_time', 'checkinTime')
      .addSelect('booking_request.checkout_time', 'checkoutTime')
      .addSelect('a.username', 'requestedBy')
      .addSelect('r.name', 'roomName')
      .addSelect('booking_request.checkin_date', 'checkinDate')
      .addSelect('br.name', 'reason')
      .addSelect('booking_request.status', 'status')
      .innerJoin(Accounts, 'a', 'a.id = booking_request.requested_by')
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .innerJoin(
        BookingReason,
        'br',
        'br.id = booking_request.booking_reason_id'
      )
      .where('booking_request.checkinDate >= :toDay', {
        toDay: date,
      })
      .andWhere('booking_request.room_id = :roomId', {
        roomId: roomId,
      })
      .andWhere("booking_request.status IN ('BOOKED')")
      .orderBy('booking_request.checkin_date', 'ASC');
    return query.getRawMany<{
      id: string;
      slotIn: number;
      slotOut: number;
      status: string;
      requestedBy: string;
    }>();
  }

  // getRequestBySlotId(slotId: string) {
  //   const date = new Date();
  //   const query = this.createQueryBuilder('booking_request')
  //     .select('booking_request.id', 'id')
  //     .addSelect('slot_in.slot_num', 'slotStartNum')
  //     .addSelect('slot_out.slot_num', 'slotEndNum')
  //     .addSelect('slot_in.name', 'checkinSlot')
  //     .addSelect('slot_out.name', 'checkoutSlot')
  //     .addSelect('a.username', 'requestedBy')
  //     .addSelect('r.name', 'roomName')
  //     .addSelect('booking_request.checkin_date', 'checkinDate')
  //     .addSelect('br.name', 'reason')
  //     .addSelect('booking_request.status', 'status')
  //     .innerJoin(Accounts, 'a', 'a.id = booking_request.requested_by')
  //     .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
  //     .innerJoin(
  //       BookingReason,
  //       'br',
  //       'br.id = booking_request.booking_reason_id'
  //     )
  //     .innerJoin(Slot, 'slot_in', 'slot_in.id = booking_request.checkin_slot')
  //     .innerJoin(
  //       Slot,
  //       'slot_out',
  //       'slot_out.id = booking_request.checkout_slot'
  //     )
  //     .innerJoin(Slot, 'slot_del', 'slot_del.id = :slotId', {
  //       slotId: slotId,
  //     })
  //     .where('booking_request.checkinDate >= :toDay', {
  //       toDay: date,
  //     })
  //     .andWhere('slot_in.slot_num <= slot_del.slot_num')
  //     .andWhere('slot_out.slot_num >= slot_del.slot_num')
  //     .andWhere("booking_request.status IN ('PENDING', 'BOOKED')")
  //     .orderBy('booking_request.checkin_date', 'ASC');
  //   return query.getRawMany<{
  //     id: string;
  //     slotIn: number;
  //     slotOut: number;
  //     status: string;
  //     requestedBy: string;
  //   }>();
  // }

  getRequestByDeviceId(deviceId: string) {
    const date = new Date();
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('booking_request.checkin_Time', 'checkinTime')
      .addSelect('booking_request.checkout_Time', 'checkoutTime')
      .addSelect('a.username', 'requestedBy')
      .addSelect('r.name', 'roomName')
      .addSelect('booking_request.checkin_date', 'checkinDate')
      .addSelect('br.name', 'reason')
      .addSelect('booking_request.status', 'status')
      .innerJoin(Accounts, 'a', 'a.id = booking_request.requested_by')
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .innerJoin(
        BookingRequestDevices,
        'brd',
        'brd.booking_request_id = booking_request.id'
      )
      .innerJoin(
        BookingReason,
        'br',
        'br.id = booking_request.booking_reason_id'
      )
      .where('booking_request.checkinDate >= :toDay', {
        toDay: date,
      })
      .andWhere('brd.device_id = :deviceId', {
        deviceId: deviceId,
      })
      .andWhere("booking_request.status IN ('PENDING', 'BOOKED')")
      .orderBy('booking_request.checkin_date', 'ASC');
    return query.getRawMany<{
      id: string;
      slotIn: number;
      slotOut: number;
      status: string;
      roomName: string;
      requestedBy: string;
    }>();
  }

  getRequestBookingByAccountId(accountId: string) {
    return this.createQueryBuilder(`booking_request`)
      .select('booking_request.id', 'id')
      .addSelect('r.name', 'roomName')
      .addSelect('a.username', 'requestedBy')
      .addSelect('booking_request.checkin_Date', 'checkinDate')
      .addSelect('booking_request.status', 'status')

      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .innerJoin(Accounts, 'a', 'a.id = booking_request.requested_by')
      .where(`booking_request.status IN (:...status)`, {
        status: ['PENDING', 'BOOKED'],
      })
      .andWhere('booking_request.requested_by = :account_id', {
        account_id: accountId,
      })
      .orderBy('booking_request.checkin_date', 'ASC')
      .getRawMany<BookingRequest>();
  }

  existsById(id: string): Promise<boolean> {
    return this.createQueryBuilder('booking_request')
      .select('COUNT(1)', 'count')
      .where('booking_request.id = :id', { id: id })
      .getRawOne<{ count: number }>()
      .then((data) => data?.count > 0);
  }

  isAcceptById(id: string): Promise<boolean> {
    return this.createQueryBuilder('booking_request')
      .select('COUNT(1)', 'count')
      .where('booking_request.id = :id', { id: id })
      .andWhere("booking_request.status = 'BOOKED'")
      .getRawOne<{ count: number }>()
      .then((data) => data?.count > 0);
  }

  isCancelledById(id: string): Promise<boolean> {
    return this.createQueryBuilder('booking_request')
      .select('COUNT(1)', 'count')
      .where('booking_request.id = :id', { id: id })
      .andWhere("booking_request.status = 'CANCELLED'")
      .getRawOne<{ count: number }>()
      .then((data) => data?.count > 0);
  }

  async countRequestBooking() {
    return await this.query(`
      SELECT COUNT(1)
      FROM booking_request br
      WHERE br.status = 'BOOKED'
      UNION ALL
      SELECT COUNT(1)
      FROM booking_request br
      WHERE br.status = 'CHECKED_IN'
      UNION ALL
      SELECT COUNT(1)
      FROM booking_request br
      WHERE br.status = 'CHECKED_OUT'
      UNION ALL
      SELECT COUNT(1)
      FROM booking_request br
      WHERE br.status = 'CANCELLED'`);
  }

  async countRequestBookingForAccountId(id: string) {
    return await this.query(`
      SELECT COUNT(1)
      FROM booking_request br
      WHERE br.status = 'BOOKED'
        AND br.booked_for = '${id}'
      UNION ALL
      SELECT COUNT(1)
      FROM booking_request br
      WHERE br.status = 'CHECKED_IN'
        AND br.booked_for = '${id}'
      UNION ALL
      SELECT COUNT(1)
      FROM booking_request br
      WHERE br.status = 'CHECKED_OUT'
        AND br.booked_for = '${id}'
      UNION ALL
      SELECT COUNT(1)
      FROM booking_request br
      WHERE br.status = 'CANCELLED'
        AND br.booked_for = '${id}'`);
  }

  async getInforToFeedback(
    id: string
  ): Promise<{ userId: string; status: string }> {
    return this.createQueryBuilder('br')
      .select('br.booked_for', 'userId')
      .addSelect('br.status', 'status')
      .where('br.id = :id', { id: id })
      .getRawOne();
  }

  async findById(id: string): Promise<BookingRequest> {
    return this.createQueryBuilder('br')
      .select('br.id', 'id')
      .addSelect('r.id', 'roomId')
      .addSelect('r.name', 'roomName')
      .addSelect('r.description', 'roomDescription')
      .addSelect('br.checkin_Date', 'checkinDate')
      .addSelect('br.status', 'status')
      .addSelect('br.booking_reason_id', 'reasonType')
      .addSelect('br.description', 'description')
      .addSelect('br.checkedin_at', 'checkinAt')
      .addSelect('br.checkedout_at', 'checkoutAt')
      .addSelect('bkr.name', 'reason')
      .addSelect('br.requested_at', 'requestedAt')
      .addSelect('a.username', 'requestedBy')
      .addSelect('br.updated_at', 'updatedAt')
      .addSelect('aa.username', 'updatedBy')
      .addSelect('br.cancelled_at', 'cancelledAt')
      .addSelect('aaa.username', 'cancelledBy')
      .addSelect('br.cancel_reason', 'cancelReason')
      .addSelect('bf.username', 'bookedFor')
      .addSelect('br.booked_for', 'bookedForId')
      .addSelect('br.checkin_time', 'checkinTime')
      .addSelect('br.checkoutTime', 'checkoutTime')
      .innerJoin(Rooms, 'r', 'r.id = br.room_id')
      .innerJoin(Accounts, 'a', 'a.id = br.requested_by')
      .leftJoin(Accounts, 'aa', 'aa.id = br.updated_by')
      .leftJoin(Accounts, 'aaa', 'aaa.id = br.cancelled_by')
      .leftJoin(Accounts, 'bf', 'bf.id = br.booked_for')
      .leftJoin(BookingReason, 'bkr', 'bkr.id = br.booking_reason_id')
      .where('br.id = :id', { id: id })
      .getRawOne<BookingRequest>();
  }

  async createNewRequest(
    payload: BookingRequestAddRequestPayload,
    userId: string,
    queryRunner: QueryRunner
  ) {
    return await queryRunner.manager.save(BookingRequest, {
      roomId: payload.roomId,
      requestedBy: userId,
      requestedAt: new Date(),
      status: 'BOOKED',
      bookingReasonId:
        payload.bookingReasonId === 'null' ? null : payload.bookingReasonId,
      description: payload.description,
      checkinTime: payload.checkinTime,
      checkoutTime: payload.checkoutTime,
      checkinDate: payload.checkinDate,
      bookedFor: payload.bookedFor || userId,
    });
  }

  async cancelRoomBookingById(
    accountId: string,
    id: string,
    reason: string,
    role: string,
    queryRunner: QueryRunner
  ) {
    const oldData = await this.findOneOrFail({
      where: {
        id: id,
      },
    });
    if (
      oldData.bookedFor === accountId ||
      role === 'Librarian' ||
      role === 'System Admin'
    ) {
      return await queryRunner.manager.save(BookingRequest, {
        ...oldData,
        status: 'CANCELLED',
        cancelReason: reason,
        updatedBy: accountId,
        updatedAt: new Date(),
        cancelledBy: accountId,
        cancelledAt: new Date(),
      });
    } else {
      throw new BadRequestException(
        "You are not allowed to cancel someone else's request"
      );
    }
  }

  async cancelRoomBookingByIdNoQueryRunner(
    accountId: string,
    id: string,
    reason: string,
    role: string
  ) {
    const oldData = await this.findOneOrFail({
      where: {
        id: id,
      },
    });
    if (
      oldData.requestedBy === accountId ||
      role === 'Librarian' ||
      role === 'System Admin'
    ) {
      return await this.save({
        ...oldData,
        status: 'CANCELLED',
        cancelReason: reason,
        updatedBy: accountId,
        updatedAt: new Date(),
        cancelledBy: accountId,
        cancelledAt: new Date(),
      });
    } else {
      throw new BadRequestException(
        "You are not allowed to cancel someone else's request"
      );
    }
  }

  // createNewBooking(payload: BookingRequestAddRequestPayload, userId: string) {
  //   if (!payload.checkoutDate || payload.checkoutDate === payload.checkinDate) {
  //     return this.save(
  //       {
  //         roomId: payload.roomId,
  //         requestedBy: userId,
  //         requestedAt: new Date(),
  //         checkinDate: payload.checkinDate,
  //         checkoutDate: payload.checkoutDate,
  //         checkinSlot: payload.checkinSlot,
  //         checkoutSlot: payload.checkoutSlot,
  //         status: 'BOOKED',
  //         description: payload.description,
  //         bookingReasonId: payload.bookingReasonId,
  //       },
  //       {
  //         transaction: true,
  //       }
  //     );
  //   }
  // }

  async acceptById(
    accountId: string,
    roomId: string,
    queryRunner: QueryRunner
  ) {
    const oldData = await this.findOneOrFail({
      where: {
        id: roomId,
      },
    });
    return await queryRunner.manager.save(BookingRequest, {
      ...oldData,
      status: 'BOOKED',
      updatedBy: accountId,
      updatedAt: new Date(),
      acceptedBy: accountId,
      acceptedAt: new Date(),
    });
  }

  async rejectById(
    accountId: string,
    roomId: string,
    reason: string,
    queryRunner: QueryRunner
  ) {
    const oldData = await this.findOneOrFail({
      where: {
        id: roomId,
      },
    });
    return await queryRunner.manager.save(BookingRequest, {
      ...oldData,
      status: 'CANCELLED',
      updatedBy: accountId,
      updatedAt: new Date(),
      cancelReason: reason,
      cancelledBy: accountId,
      cancelledAt: new Date(),
    });
  }

  findCurrentCheckoutInformation(accountId: string) {
    return this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('a.username', 'requestedBy')
      .addSelect('booking_request.id', 'description')
      .addSelect('booking_request.status', 'status')
      .addSelect('booking_request.checkin_time', 'checkinTime')
      .addSelect('booking_request.checkout_time', 'checkoutTime')
      .addSelect('booking_request.checkedin_at', 'checkedinAt')
      .addSelect('booking_request.checkedout_at', 'checkedoutAt')
      .addSelect('booking_request.checkin_date', 'checkinDate')
      .addSelect('booking_request.requested_at', 'requestedAt')
      .addSelect('r.name', 'roomName')
      .addSelect('rt.name', 'roomType')
      .addSelect('booking_request.accepted_by', 'acceptedBy')
      .addSelect('booking_request.accepted_at', 'acceptedAt')
      .addSelect('br.name', 'bookingReason')
      .innerJoin(
        BookingReason,
        'br',
        'br.id = booking_request.booking_reason_id'
      )
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .innerJoin(RoomType, 'rt', 'rt.id = r.type')
      .innerJoin(Accounts, 'a', 'a.id = booking_request.requested_by')
      .where('booking_request.requested_by = :accountId', {
        accountId: accountId,
      })
      .andWhere('booking_request.status = :status', { status: 'CHECKED_IN' })
      .andWhere('booking_request.checkedout_at IS NULL')
      .andWhere('booking_request.checkedin_at IS NOT NULL')
      .andWhere('booking_request.cancelled_at IS NULL')
      .andWhere('booking_request.cancelled_by IS NULL')
      .getRawOne();
  }

  checkoutBookingRoom(id: string, accountId: string) {
    return this.createQueryBuilder('booking_request')
      .update({
        status: 'CHECKED_OUT',
        updatedAt: new Date(),
        updatedBy: accountId,
        checkedoutAt: new Date(),
      })
      .where('booking_request.id = :id', { id: id })
      .useTransaction(true)
      .execute();
  }

  findBookingRoomHistory(
    accountId: string,
    filters: GetAllBookingRequestsFilter
  ) {
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('r.name', 'roomName')
      .addSelect('rt.name', 'roomType')
      .addSelect('booking_request.requested_at', 'requestedAt')
      .addSelect('booking_request.requested_by', 'requestedBy')
      .addSelect('booking_request.status', 'status')
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .innerJoin(RoomType, 'rt', 'r.type = rt.id')
      .where('booking_request.requested_by = :accountId', {
        accountId: accountId,
      })
      .andWhere('r.name LIKE :name', { name: `%${filters.roomName}%` })
      .andWhere('booking_request.checkin_date >= :dateStart', {
        dateStart: filters.dateStart,
      })
      .andWhere('booking_request.checkin_date <= :dateEnd', {
        dateEnd: filters.dateEnd,
      })
      .andWhere(
        '(booking_request.checkinTime <= :checkinTime OR booking_request.checkoutTime >= :checkinTime)',
        {
          checkinTime: filters.checkinTime,
        }
      )
      .andWhere(
        '(booking_request.checkinTime <= :checkoutTime OR booking_request.checkoutTime >= :checkoutTime)',
        {
          checkoutTime: filters.checkoutTime,
        }
      );
    if (filters.status) {
      query.andWhere('booking_request.status IN (:...status)', {
        status: JSON.parse(filters.status),
      });
    }
    return query.getRawMany();
  }

  findCurrentCheckinInformation(accountId: string) {
    return this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('booking_request.room_id', 'roomId')
      .addSelect('a.username', 'requestedBy')
      .addSelect('booking_request.requested_at', 'requestedAt')
      .addSelect('booking_request.description', 'description')
      .addSelect('br.name', 'bookingReason')
      .addSelect('r.name', 'roomName')
      .addSelect('booking_request.checkin_date', 'checkinDate')
      .addSelect('booking_request.checkin_time', 'checkinTime')
      .addSelect('booking_request.checkout_time', 'checkoutTime')
      .innerJoin(Accounts, 'a', 'a.id = booking_request.requested_by')
      .innerJoin(Rooms, 'r', 'booking_request.room_id = r.id')
      .innerJoin(
        BookingReason,
        'br',
        'br.id = booking_request.booking_reason_id'
      )
      .where('booking_request.requested_by = :requestedBy', {
        requestedBy: accountId,
      })
      .andWhere('booking_request.status = :status', { status: 'BOOKED' })
      .andWhere('booking_request.cancelled_by IS NULL')
      .andWhere('booking_request.cancelled_at IS NULL')
      .andWhere('booking_request.checkedin_at IS NULL')
      .andWhere('booking_request.checkedout_at IS NULL')
      .orderBy('booking_request.checkin_date', 'ASC')
      .addOrderBy('booking_request.checkin_time', 'ASC')
      .limit(1)
      .getRawOne();
  }

  attemptCheckinBookingRoom(
    accountId: string,
    bookingRequestId: string,
    signature: string
  ) {
    return this.createQueryBuilder('booking_request')
      .update({
        signatureCheckin: signature,
        updatedAt: new Date(),
        updatedBy: accountId,
      })
      .where('booking_request.id = :id', { id: bookingRequestId })
      .andWhere('booking_request.status = :status', { status: 'BOOKED' })
      .andWhere('booking_request.checkedout_at IS NULL')
      .andWhere('booking_request.checkedin_at IS NULL')
      .useTransaction(true)
      .execute();
  }

  async attemptCheckoutBookingRoom(
    accountId: string,
    bookingRequestId: string,
    signature: string
  ) {
    return this.createQueryBuilder('booking_request')
      .update({
        signatureCheckout: signature,
        updatedAt: new Date(),
        updatedBy: accountId,
      })
      .where('booking_request.id = :id', { id: bookingRequestId })
      .andWhere('booking_request.status = :status', { status: 'CHECKED_IN' })
      .andWhere('booking_request.checkedout_at IS NULL')
      .useTransaction(true)
      .execute();
  }

  async acceptCheckinById(accountId: string, id: string) {
    return this.createQueryBuilder('booking_request')
      .update({
        updatedBy: accountId,
        updatedAt: new Date(),
        checkedinAt: new Date(),
        status: 'CHECKED_IN',
      })
      .where('booking_request.id = :id', { id: id })
      .andWhere('booking_request.status = :status', { status: 'BOOKED' })
      .andWhere('booking_request.checkedin_at IS NULL')
      .useTransaction(true)
      .execute();
  }

  // async rejectCheckinById(accountId: string, id: string) {
  //   return this.createQueryBuilder('booking_request')
  //     .update({
  //       updatedBy: accountId,
  //       updatedAt: new Date(),
  //       checkedoutAt: new Date(),
  //       status: 'CANCELLED',
  //     })
  //     .where('booking_request.id = :id', {id: id})
  //     .andWhere('booking_request.status = :status', {status: 'CHECKED_IN'})
  //     .andWhere('booking_request.checkedout_at IS NULL')
  //     .useTransaction(true)
  //     .execute();
  // }

  async acceptCheckoutById(accountId: string, id: string) {
    return this.createQueryBuilder('booking_request')
      .update({
        updatedAt: new Date(),
        updatedBy: accountId,
        status: 'CHECKED_OUT',
        checkedoutAt: new Date(),
      })
      .where('booking_request.id = :id', { id: id })
      .useTransaction(true)
      .execute();
  }

  // async rejectCheckoutById(accountId: string, id: string) {
  //   return this.createQueryBuilder('booking_request')
  //     .update({
  //       updatedAt: new Date(),
  //       updatedBy: accountId,
  //       status: 'CANCELLED',
  //       checkedoutAt: new Date(),
  //     })
  //     .where('booking_request.id = :id', {id: id})
  //     .useTransaction(true)
  //     .execute();
  // }

  async findBookingRequestsByFilter(
    filters: GetAllBookingRequestsFilter,
    accountId: string
  ) {
    const query = this.createQueryBuilder('booking_request')
      .select('booking_request.id', 'id')
      .addSelect('r.name', 'roomName')
      .addSelect('rt.name', 'roomType')
      .addSelect('booking_request.checkin_date', 'checkinDate')
      .addSelect('booking_request.checkin_time', 'checkinTime')
      .addSelect('booking_request.checkout_time', 'checkoutTime')
      .addSelect('booking_request.status', 'status')
      .addSelect('a.username', 'requestedBy')
      .addSelect('aa.username', 'bookedFor')
      .innerJoin(Accounts, 'a', 'a.id = booking_request.requested_by')
      .innerJoin(Accounts, 'aa', 'aa.id = booking_request.booked_for')
      .innerJoin(Rooms, 'r', 'r.id = booking_request.room_id')
      .innerJoin(RoomType, 'rt', 'rt.id = r.type')

      .where('r.name LIKE :name', { name: `%${filters.roomName}%` });
    if (filters.dateStart) {
      query.andWhere('booking_request.checkin_date >= :dateStart', {
        dateStart: filters.dateStart,
      });
    }
    if (filters.dateEnd) {
      query.andWhere('booking_request.checkin_date <= :dateEnd', {
        dateEnd: filters.dateEnd,
      });
    }
    if (filters.checkinTime) {
      query.andWhere(
        '(booking_request.checkinTime >= :checkinTime)',
        {
          checkinTime: filters.checkinTime,
        }
      );
    }
    if (filters.checkoutTime) {
      query.andWhere(
        '(booking_request.checkoutTime <= :checkoutTime)',
        {
          checkoutTime: filters.checkoutTime,
        }
      );
    }
    if (accountId) {
      query.andWhere('aa.id = :accountId', { accountId: accountId });
    }
    if (filters.status) {
      query.andWhere('booking_request.status IN (:...status)', {
        status: JSON.parse(filters.status),
      });
    }
    return query.getRawMany<BookingRequest>();
  }

  async isConflictWithStartEndDateTime(
    date: string,
    timeStart: string,
    timeEnd: string,
    userId: string
  ): Promise<boolean> {
    /*
SELECT * FROM booking_request br WHERE br.status IN ('BOOKED', 'CHECKED_IN') AND br.checkin_date = '2022-10-08'
                                   AND ( br.checkin_time BETWEEN '13:33' AND '14:00'
                                            OR
                                         br.checkout_time BETWEEN '13:33' AND '14:00'
                                       OR
                                         '13:33' BETWEEN br.checkin_time AND br.checkout_time)
                                   AND br.booked_for = '1de1d111-1d80-40d0-ac86-c1bdd23275d7'
    * */
    return await this.createQueryBuilder('booking_request')
      .select('COUNT(1)', 'count')
      .where('booking_request.status IN (:...status)', {
        status: ['BOOKED', 'CHECKED_IN'],
      })
      .andWhere('booking_request.checkin_date = :checkInDate', {checkInDate: date})
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('booking_request.checkin_time BETWEEN :checkInStartTime AND :checkOutTime', {
              checkInStartTime: timeStart, checkOutTime: timeEnd,
            })
            .orWhere('booking_request.checkout_time BETWEEN :checkInEndTime AND :checkOutTime', {
              checkInEndTime: timeStart, checkOutTime: timeEnd,
            })
            .orWhere(':checkInTime BETWEEN booking_request.checkin_time AND booking_request.checkout_time', {
              checkInTime: timeStart
            })
        )
      )
      .andWhere('booking_request.booked_for = :userId', { userId })
      .getRawOne<{ count: number }>()
      .then((data) => data?.count > 0);
  }
}
