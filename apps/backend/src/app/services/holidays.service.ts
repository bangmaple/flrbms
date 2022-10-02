import {BadRequestException, forwardRef, Inject, Injectable, Logger,} from '@nestjs/common';
import {DataSource, QueryRunner} from 'typeorm';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {Holidays} from '../models';
import {HolidayAddRequestPayload} from '../payload/request/holidays-add.request.payload';
import {HolidaysRepository} from '../repositories/holidays.repository';
import {PaginationParams} from '../dto/pagination.dto';
import {BookingRoomService} from './booking-room.service';
import dayjs = require('dayjs');
import {RoleService} from "./role.service";

@Injectable()
export class HolidaysService {
  private readonly logger = new Logger(HolidaysService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: HolidaysRepository,

    @Inject(forwardRef(() => BookingRoomService))
    private readonly bookingRoomService: BookingRoomService,
  ) {
  }

  async getAll(request: PaginationParams) {
    try {
      if (!request || !request.page) {
        return await this.repository.findAllHolidaysInDayArray();
      }

      const result = await this.repository.searchHoliday(request);
      if (
        result.meta.totalPages > 0 &&
        result.meta.currentPage > result.meta.totalPages
      ) {
        throw new BadRequestException('Current page is over');
      }
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message || 'One or more parameters is invalid'
      );
    }
  }

  async getHolidayMini() {
    try {
      const today = dayjs(new Date()).format('YYYY-MM-DD');
      return await this.repository.getHolidayMini(today);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async findById(id: string): Promise<Holidays> {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Holiday does not found with the provided id'
        );
      }
      const result = await this.repository.findById(id);
      if (!result) {
        throw new BadRequestException('This holiday is already deleted');
      }
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ?? 'An error occurred while retrieving this holiday'
      );
    }
  }

  async validateAdd(
    user: KeycloakUserInstance,
    holiday: HolidayAddRequestPayload,
    queryRunner: QueryRunner
  ) {
    try {
      if (holiday.dateStart > holiday.dateEnd) {
        throw new BadRequestException(
          'Date Start must be less than or equal to Date End'
        );
      }

      const holidayDeletedSameName =
        await this.repository.getHolidayDeletedByName(holiday.name);
      let holidayAdded;
      if (holidayDeletedSameName) {
        holidayAdded =
          await this.repository.restoreDeletedHolidayIsDuplicateName(
            holiday,
            user.account_id,
            holidayDeletedSameName.id,
            queryRunner
          );
      } else {
        const isExisted = await this.repository.isExistedByNameActive(
          holiday.name
        );
        if (isExisted) {
          throw new BadRequestException(
            'There is already existed holiday with this name. Try with another name.'
          );
        }
        holidayAdded = await this.repository.createNewHoliday(
          user.account_id,
          holiday,
          queryRunner
        );
      }
      if (await this.isHoliday(holiday.dateStart, holiday.dateEnd, null)) {
        throw new BadRequestException(
          'There is already existed holiday which is started and ended in this date range. Choose another date starts and date ends'
        );
      }

      return holidayAdded;
    } catch (e) {
      throw new BadRequestException(
        e.message ?? 'Error occurred while adding this holiday'
      );
    }
  }

  async add(
    user: KeycloakUserInstance,
    holiday: HolidayAddRequestPayload
  ): Promise<Holidays> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const holidayAdded = await this.validateAdd(user, holiday, queryRunner);

      const listRequestBooked =
        await this.bookingRoomService.getListRequestInDayRange({
          dateStart: holiday.dateStart,
          dateEnd: holiday.dateEnd,
        });
      if (listRequestBooked.length > 0) {
        const reason = `Admin added a new holiday. Your request was canceled because check in date coincides holiday. Please rebook for another day.`;
        for (let i = 0; i < listRequestBooked.length; i++) {
          await this.bookingRoomService.cancelRequest(
            user.account_id,
            listRequestBooked[i].id,
            reason,
            queryRunner
          );
        }
      }

      await queryRunner.commitTransaction();
      return holidayAdded;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        e.message ?? 'Error occurred while adding this holiday'
      );
    } finally {
      await queryRunner.release();
    }
  }

  async import(user: KeycloakUserInstance, holiday: any[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (let i = 1; i < holiday.length; i++) {
        await this.validateAdd(
          user,
          {
            name: holiday[i][0],
            dateStart: dayjs(holiday[i][1]).format('YYYY-MM-DD'),
            dateEnd: dayjs(holiday[i][2]).format('YYYY-MM-DD'),
            description: holiday[i][3],
          },
          queryRunner
        );

        const listRequestBooked =
          await this.bookingRoomService.getListRequestInDayRange({
            dateStart: dayjs(holiday[i][1]).format('YYYY-MM-DD'),
            dateEnd: dayjs(holiday[i][2]).format('YYYY-MM-DD'),
          });
        if (listRequestBooked.length > 0) {
          const reason = `Admin added a new holiday. Your request was cancelled because check in date coincides holiday. Please rebook for another day.`;
          for (let i = 0; i < listRequestBooked.length; i++) {
            await this.bookingRoomService.cancelRequest(
              user.account_id,
              listRequestBooked[i].id,
              reason,
              queryRunner
            );
          }
        }
      }

      await queryRunner.commitTransaction();
      return null;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        e.message ?? 'Error occurred while adding this holiday'
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateById(
    accountId: string,
    id: string,
    body: HolidayAddRequestPayload
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Holiday does not found with the provided id'
        );
      }
      const data = await this.repository.findById(id);
      if (data === undefined) {
        throw new BadRequestException('This holiday is already deleted');
      }
      if (body.dateStart > body.dateEnd) {
        throw new BadRequestException(
          'Date Start must be less than or equal to Date End'
        );
      }
      const isExistedByName = await this.repository.isExistedByNameActiveUpdate(
        body.name,
        id
      );
      if (isExistedByName) {
        throw new BadRequestException(
          'There is already existed holiday with the this name. Try with another name.'
        );
      }
      if (await this.isHoliday(body.dateStart, body.dateEnd, id)) {
        throw new BadRequestException(
          'There is already existed holiday which is started and ended in this date range. Choose another date starts and date ends'
        );
      }
      const listRequestBooked =
        await this.bookingRoomService.getListRequestInDayRange({
          dateStart: body.dateStart,
          dateEnd: body.dateEnd,
        });
      if (listRequestBooked.length > 0) {
        const reason = `Admin updated a holiday. Your request was cancelled because check in date coincides new updated holiday. Please rebook for another day.`;
        for (let i = 0; i < listRequestBooked.length; i++) {
          await this.bookingRoomService.cancelRequest(
            accountId,
            listRequestBooked[i].id,
            reason,
            queryRunner
          );
        }
      }
      const holidayUpdated = await this.repository.updateById(
        accountId,
        id,
        body,
        queryRunner
      );
      await queryRunner.commitTransaction();
      return holidayUpdated;
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        e.message ?? 'Error occurred while updating this holiday'
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteById(accountId: string, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Holiday does not found with the provided id'
        );
      }
      const isDeleted = await this.repository.checkIfHolidayIsDeletedById(id);
      if (isDeleted) {
        throw new BadRequestException('This holiday is already deleted');
      }
      const holiday = await this.repository.deleteById(
        accountId,
        id,
        queryRunner
      );
      await queryRunner.commitTransaction();

      return holiday;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getDeletedHolidays(search: string): Promise<Holidays[]> {
    try {
      return await this.repository.findDeletedHolidays(search);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ?? 'An error occurred while getting deleted holidays'
      );
    }
  }

  async restoreDeletedHolidayById(accountId: string, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Holiday does not found with the provided id'
        );
      }
      const isDeleted = await this.repository.checkIfHolidayIsDeletedById(id);
      if (!isDeleted) {
        throw new BadRequestException(
          'This holiday ID is now active. Cannot restore it'
        );
      }

      const holiday = await this.repository.restoreDeletedHolidayById(
        id,
        accountId,
        queryRunner
      );
      await queryRunner.commitTransaction();
      return holiday;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async isHoliday(dateStartString: string, dateEndString: string, holidayId: string) {
    try {
      const dateStart = dayjs(dateStartString).format('YYYY-MM-DD');
      const dateEnd = dayjs(dateEndString).format('YYYY-MM-DD');
      return await this.repository.isHoliday(dateStart, dateEnd, holidayId);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }
}
