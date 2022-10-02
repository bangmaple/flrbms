import {QueryRunner, Repository} from 'typeorm';
import {Accounts, Devices, Rooms} from '../models';
import {AddDeviceRequest} from '@app/models';
import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {paginateRaw,} from 'nestjs-typeorm-paginate';
import {DeviceType} from '../models/device-type.entity';
import {DevicesPaginationParams} from '../dto/devices-pagination.dto';
import {DataAddRequestPayload} from '../payload/request/data-add.request.payload';

@CustomRepository(Devices)
export class DevicesRepository extends Repository<Devices> {
  async existsById(id: string): Promise<boolean> {
    return this.createQueryBuilder('devices')
      .select('COUNT(1)', 'count')
      .where('devices.id = :id', {id: id})
      .getRawOne()
      .then((data) => data?.count > 0);
  }

  async getSize(): Promise<number> {
    const result = await this.createQueryBuilder(`devices`)
      .select(`COUNT(id) as size`)
      .where(`devices.disabled_at IS NULL`)
      .andWhere(`devices.deleted_at IS NULL`)
      .getRawOne<{
        size: number;
      }>();
    return result.size;
  }

  async isExistedByNameActive(name: string): Promise<boolean> {
    return this.createQueryBuilder('devices')
      .select('COUNT(devices.name)')
      .where('devices.name = :name', {name})
      .getRawOne()
      .then((data) => data['count'] > 0);
  }

  getDeviceDeletedByName(name: string) {
    return this.createQueryBuilder('device')
      .select('device.id', 'id')
      .where('device.deleted_at IS NOT NULL')
      .andWhere('device.name = :name', {name})
      .getRawOne();
  }

  searchDevices(payload: DevicesPaginationParams) {
    const query = this.createQueryBuilder('d')
      .select('d.id', 'id')
      .addSelect('d.name', 'name')
      .addSelect('d.description', 'description')
      .addSelect('d.createdAt', 'createdAt')
      .addSelect('d.updatedAt', 'updatedAt')
      .addSelect('dt.name', 'type')
      .innerJoin(DeviceType, 'dt', 'dt.id = d.type')
      .where('(d.name ILIKE :search OR dt.name ILIKE :search)', {
        search: `%${payload.search?.trim() || ''}%`,
      })
      .andWhere(`d.deleted_at IS NULL`)
      .andWhere(`d.disabled_at IS NULL`)
      .orderBy(payload.sort, payload.dir as 'ASC' | 'DESC');
    if (payload.deviceType && payload.deviceType !== '') {
      query.andWhere('dt.name = :deviceTypeName', {
        deviceTypeName: payload.deviceType,
      });
    }
    return paginateRaw<Devices>(query, {
      limit: payload.limit,
      page: payload.page,
    });
  }

  findDeviceName(search: string, dir: string): Promise<Devices[]> {
    const query = this.createQueryBuilder('device')
      .select('device.id', 'id')
      .addSelect('device.name', 'name')
      .addSelect('dt.name', 'type')
      .leftJoin(DeviceType, 'dt', 'dt.id = device.type')
      .andWhere('device.disabled_at IS NULL')
      .andWhere('device.disabled_by IS NULL')
      .andWhere('device.deleted_by IS NULL')
      .andWhere('device.deleted_at IS NULL')
      .orderBy(
        'device.name',
        dir ? (dir as 'ASC' | 'DESC') : ('ASC' as 'ASC' | 'DESC')
      );
    if (search) {
      query.andWhere('device.name ILIKE :search', {search: `%${search}%`});
    }

    return query.getRawMany<Devices>();
  }

  getDevicesByDeviceType(deviceTypeId: string) {
    return this.createQueryBuilder(`device`)
      .select('device.id', 'id')
      .addSelect('device.name', 'name')
      .addSelect('device.type', 'type')
      .addSelect('dt.name', 'deviceTypeName')
      .innerJoin(DeviceType, 'dt', 'dt.id = device.type')
      .where(`device.deleted_at IS NULL`)
      .andWhere(`device.disabled_at IS NULL`)
      .andWhere('device.type = :type', {type: deviceTypeId})

      .getRawMany<Devices>();
  }

  async findById(id: string): Promise<Devices> {
    return this.createQueryBuilder('devices')
      .select('devices.id', 'id')
      .addSelect('devices.name', 'name')
      .addSelect('devices.description', 'description')
      .addSelect('devices.created_at', 'createdAt')
      .addSelect('devices.updated_at', 'updatedAt')
      .addSelect('devices.disabled_at', 'disableAt')
      .addSelect('devices.deleted_at', 'deletedAt')
      .addSelect('devices.disabled_by', 'disabledBy')
      .addSelect('devices.deleted_by', 'deletedBy')
      .addSelect('devices.type', 'deviceTypeId')
      .addSelect('dt.name', 'deviceTypeName')
      .addSelect('a.username', 'createdBy')
      .addSelect('aa.username', 'updatedBy')
      .innerJoin(Accounts, 'a', 'devices.created_by = a.id')
      .leftJoin(Accounts, 'aa', 'devices.updated_by = aa.id')
      .innerJoin(DeviceType, 'dt', 'dt.id = devices.type')
      // .where('devices.disabled_at IS NULL')
      .where('devices.deleted_at IS NULL')
      .andWhere('devices.id = :deviceId', {deviceId: id})
      .getRawOne<Devices>();
  }

  createNewDevice(
    payload: AddDeviceRequest,
    userId: string,
    queryRunner: QueryRunner
  ): Promise<Devices> {
    return queryRunner.manager.save(Devices, {
      name: payload.name.trim(),
      description: payload.description,
      type: payload.type,
      createdBy: userId,
      createdAt: new Date(),
    });
  }

  async updateById(
    accountId: string,
    deviceId: string,
    payload: DataAddRequestPayload
  ) {
    const oldData = await this.findOneOrFail({
      where: {
        id: deviceId,
      },
    });
    return this.save(
      {
        ...oldData,
        id: deviceId,
        name: payload.name.trim(),
        description: payload.description,
        type: payload.type,
        updatedBy: accountId,
        updatedAt: new Date(),
      },
      {
        transaction: true,
      }
    );
  }

  async updateTypeThenRestore(
    accountId: string,
    deviceId: string,
    payload: { type: string },
    queryRunner: QueryRunner
  ) {
    const oldData = await this.findOneOrFail({
      where: {
        id: deviceId,
      },
    });
    return queryRunner.manager.save(
      Devices,
      {
        ...oldData,
        id: deviceId,
        type: payload.type,
        updatedBy: accountId,
        updatedAt: new Date(),
        disabledBy: null,
        disabledAt: null,
      }
    );
  }

  async checkIfDeviceIsDeletedById(id: string): Promise<boolean> {
    return this.createQueryBuilder('devices')
      .select('devices.deleted_at')
      .where('devices.id = :id', {id: id})
      .getRawOne<boolean>()
      .then((data) => (data ? data['deleted_at'] : true));
  }

  async checkIfDeviceIsDisabledById(id: string): Promise<boolean> {
    return this.createQueryBuilder('devices')
      .select('devices.disabled_at')
      .where('devices.id = :id', {id: id})
      .getRawOne<boolean>()
      .then((data) => (data ? data['disabled_at'] : true));
  }

  async disableById(accountId: string, id: string) {
    const isDisabled = await this.createQueryBuilder('devices')
      .update({
        disabledBy: accountId,
        disabledAt: new Date(),
      })
      .where('devices.id = :id', {id: id})
      .useTransaction(true)
      .execute();
    if (isDisabled.affected > 0) {
      return this.findOneOrFail({
        where: {
          id: id,
        },
      });
    }
  }

  getDisabledDevices(search: string) {
    return this.createQueryBuilder('devices')
      .select('devices.id', 'id')
      .addSelect('devices.name', 'name')
      .addSelect('devices.disabled_at', 'disabledAt')
      .addSelect('a.username', 'disabledBy')
      .addSelect('dt.name', 'deviceTypeName')
      .addSelect('dt.deleted_at', 'isTypeDeleted')
      .innerJoin(Accounts, 'a', 'devices.disabled_by = a.id')
      .leftJoin(DeviceType, 'dt', 'devices.type = dt.id')
      .where(`devices.deleted_at IS NULL`)
      .andWhere(`devices.disabled_at IS NOT NULL`)
      .andWhere('devices.name ILIKE :search', {search: `%${search.trim()}%`})
      .getRawMany<Rooms>();
  }

  async restoreDisabledDeviceById(accountId: string, id: string) {
    const isRestored = await this.createQueryBuilder('devices')
      .update({
        disabledAt: null,
        disabledBy: null,
        updatedAt: new Date(),
        updatedBy: accountId,
      })
      .where('devices.id = :id', {id: id})
      .useTransaction(true)
      .execute();
    if (isRestored.affected > 0) {
      return this.findOneOrFail({
        where: {
          id: id,
        },
      });
    }
  }

  async deleteById(accountId: string, id: string, queryRunner: QueryRunner) {
    const oldData = await this.findOneOrFail({
      where: {
        id: id,
      },
    });
    return queryRunner.manager.save(Devices, {
      ...oldData,
      deletedAt: new Date(),
      deletedBy: accountId,
      disabledAt: null,
      disabledBy: null,
      type: null,
    });
  }

  getDeletedDevices(search: string) {
    return this.createQueryBuilder(`devices`)
      .select('devices.id', 'id')
      .addSelect('devices.name', 'name')
      .addSelect('devices.deleted_at', 'deletedAt')
      .addSelect('a.username', 'deletedBy')
      .addSelect('dt.name', 'deviceTypeName')
      .innerJoin(Accounts, 'a', 'devices.deleted_by = a.id')
      .innerJoin(DeviceType, 'dt', 'dt.id = devices.type')
      .where(`devices.deleted_at IS NOT NULL`)
      .andWhere(`devices.disabled_at IS NULL`)
      .andWhere('devices.name ILIKE :name', {name: `%${search.trim()}%`})
      .getRawMany<Devices>();
  }

  async restoreDeletedDeviceById(
    device: Devices,
    accountId: string,
    id: string,
    queryRunner: QueryRunner
  ) {
    return queryRunner.manager.save(Devices, {
      id: id,
      name: device.name,
      description: device.description,
      type: device.type,
      deletedBy: null,
      deletedAt: null,
      createdBy: accountId,
      createdAt: new Date(),
      updatedBy: accountId,
      updatedAt: new Date(),
    });
  }

  // findDeviceListByBookingRoomRequest(name: string, type: string, sort: string) {
  //   return this.createQueryBuilder('devices')
  //     .select(['devices.id', 'devices.name'])
  //     .where('devices.disabled_at IS NULL')
  //     .andWhere('devices.deleted_at IS NULL')
  //     .andWhere('devices.name LIKE :name', { name: `%${name}%` })
  //     .orderBy('devices.name', sort as 'ASC' | 'DESC')
  //     .getMany();
  // }
  async findIdsByGivenIds(deviceIds: string[]): Promise<string[]> {
    const response = await this.createQueryBuilder('devices')
      .select('devices.id', 'id')
      .where('id IN (:...ids)', {ids: deviceIds})
      .getRawMany<{ id: string }>();
    return response.map((d) => d.id);
  }
}
