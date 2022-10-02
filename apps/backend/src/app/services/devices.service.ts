import {BadRequestException, forwardRef, Inject, Injectable, Logger,} from '@nestjs/common';
import {DevicesRepository} from '../repositories/devices.repository';
import {AddDeviceRequest} from '@app/models';
import {Devices} from '../models';
import {DeviceHistService} from './devices-hist.service';
import {DevicesPaginationParams} from '../dto/devices-pagination.dto';
import {DataAddRequestPayload} from '../payload/request/data-add.request.payload';
import {BookingRoomService} from './booking-room.service';
import {DataSource} from 'typeorm';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: DevicesRepository,
    private readonly histService: DeviceHistService,
    @Inject(forwardRef(() => BookingRoomService))
    private readonly bookingRoomService: BookingRoomService
  ) {
  }

  async getAll(request: DevicesPaginationParams) {
    try {
      const result = await this.repository.searchDevices(request);
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

  async getDevicesByDeviceType(deviceTypeId: string): Promise<Devices[]> {
    try {
      return await this.repository.getDevicesByDeviceType(deviceTypeId);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        'An error occurred while getting rooms by type ' + deviceTypeId
      );
    }
  }

  async getDeviceNames(search: string, dir: string) {
    try {
      return await this.repository.findDeviceName(search, dir);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async findById(id: string): Promise<Devices> {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Device does not found with the provided id'
        );
      }
      const result = await this.repository.findById(id);
      if (!result) {
        throw new BadRequestException('This device is already deleted');
      }
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ?? 'An error occurred while retrieving this Device'
      );
    }
  }

  async add(payload: AddDeviceRequest, userId: string): Promise<Devices> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const deviceDeletedSameName =
        await this.repository.getDeviceDeletedByName(payload.name);

      let deviceAdded;

      if (deviceDeletedSameName) {
        deviceAdded = await this.repository.restoreDeletedDeviceById(
          payload,
          userId,
          deviceDeletedSameName.id,
          queryRunner
        );
      } else {
        const isExisted = await this.repository.isExistedByNameActive(
          payload.name.trim()
        );
        if (isExisted) {
          throw new BadRequestException('Device name is duplicated!');
        }
        deviceAdded = await this.repository.createNewDevice(
          payload,
          userId,
          queryRunner
        );
        await this.histService.createNew(deviceAdded, queryRunner);
      }

      await queryRunner.commitTransaction();
      return deviceAdded;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        e.message || 'Error while creating a new device'
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateById(accountId: string, id: string, body: DataAddRequestPayload) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Device does not found with the provided id'
        );
      }
      const data = await this.repository.findById(id);
      if (data === undefined) {
        throw new BadRequestException(
          'This device is already deleted or disabled'
        );
      }
      const deviceUpdated = await this.repository.updateById(
        accountId,
        id,
        body
      );
      await this.histService.createNew(deviceUpdated, queryRunner);

      await queryRunner.commitTransaction();
      return deviceUpdated;
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      if (
        e.message.includes('constraint') &&
        e.message.includes('devices_device_type_id_fk')
      ) {
        throw new BadRequestException(
          'There is no device type with the provided id'
        );
      }
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async updateTypeThenRestore(
    accountId: string,
    id: string,
    body: { type: string }
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const isExisted = await this.repository.existsById(id);
    if (!isExisted) {
      throw new BadRequestException(
        'Device does not found with the provided id'
      );
    }
    const data = await this.repository.findById(id);
    if (data === undefined) {
      throw new BadRequestException('This device is already deleted');
    }
    try {
      const deviceUpdated = await this.repository.updateTypeThenRestore(
        accountId,
        id,
        body,
        queryRunner
      );

      await this.histService.createNew(deviceUpdated, queryRunner);

      await queryRunner.commitTransaction();
      return deviceUpdated;
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        e.message ?? 'Error occurred while updating this room'
      );
    } finally {
      await queryRunner.release();
    }
  }

  async disableById(accountId: string, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Device does not found with the provided id'
        );
      }
      const isDisabled = await this.repository.checkIfDeviceIsDisabledById(id);
      if (isDisabled) {
        throw new BadRequestException('This device is already disabled');
      }
      const isDeleted = await this.repository.checkIfDeviceIsDeletedById(id);
      if (isDeleted) {
        throw new BadRequestException(
          'This device is already deleted, can not disable'
        );
      }
      const device = await this.repository.disableById(accountId, id);
      await this.histService.createNew(device, queryRunner);
      await queryRunner.commitTransaction();
      return device;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getDisabledDevices(search: string): Promise<Devices[]> {
    try {
      return await this.repository.getDisabledDevices(search);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException('Error while disabling this device');
    }
  }

  async handleRestoreDisabledDeviceById(accountId: string, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Device does not found with the provided id'
        );
      }
      const isDeleted = await this.repository.checkIfDeviceIsDeletedById(id);
      if (isDeleted) {
        throw new BadRequestException('This device is already deleted');
      }
      const isDisabled = await this.repository.checkIfDeviceIsDisabledById(id);
      if (!isDisabled) {
        throw new BadRequestException(
          'This device ID is now active. Cannot restore it'
        );
      }
      const device = await this.repository.restoreDisabledDeviceById(
        accountId,
        id
      );
      await this.histService.createNew(device, queryRunner);

      await queryRunner.commitTransaction();
      return device;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
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
          'Device does not found with the provided id'
        );
      }

      const device = await this.repository.findById(id);

      const listRequestUseDevice =
        await this.bookingRoomService.getRequestByDeviceId(id);

      for (let i = 0; i < listRequestUseDevice.length; i++) {
        throw new BadRequestException(
          'There are already request in BOOKED state using this device. You cannot delete it.'
        );
      }

      const isDeleted = await this.repository.checkIfDeviceIsDeletedById(id);
      if (isDeleted) {
        throw new BadRequestException('This device is already deleted');
      }
      const deviceDeleted = await this.repository.deleteById(
        accountId,
        id,
        queryRunner
      );
      await this.histService.createNew(deviceDeleted, queryRunner);

      await queryRunner.commitTransaction();
      return deviceDeleted;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getDeletedDevices(search: string): Promise<Devices[]> {
    try {
      return await this.repository.getDeletedDevices(search);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException('Error while get deleted devices');
    }
  }

  // async handleRestoreDeletedDeviceById(id: string) {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const isExisted = await this.repository.existsById(id);
  //     if (!isExisted) {
  //       throw new BadRequestException(
  //         'Device does not found with the provided id'
  //       );
  //     }
  //     const isDisabled = await this.repository.checkIfDeviceIsDisabledById(id);
  //     if (isDisabled) {
  //       throw new BadRequestException('This device is already disabled');
  //     }
  //     const isDeleted = await this.repository.checkIfDeviceIsDeletedById(id);
  //     if (!isDeleted) {
  //       throw new BadRequestException(
  //         'This device ID is now active. Cannot restore it'
  //       );
  //     }

  //     const device = await this.repository.restoreDeletedDeviceById(id);
  //     await this.histService.createNew(device, queryRunner);

  //     await queryRunner.commitTransaction();
  //     return device;
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     await queryRunner.rollbackTransaction();
  //     throw new BadRequestException(e.message);
  //   }
  // }

  // getBookingRoomDeviceList(name: string, type: string, sort: string) {
  //   if (!sort) sort = 'ASC';
  //   if (sort !== 'ASC' && sort !== 'DESC') {
  //     sort = 'ASC';
  //   }

  //   return this.repository.findDeviceListByBookingRoomRequest(name, type, sort);
  // }
  async findIdsByGivenIds(deviceIds: string[]): Promise<string[]> {
    return await this.repository.findIdsByGivenIds(deviceIds);
  }
}
