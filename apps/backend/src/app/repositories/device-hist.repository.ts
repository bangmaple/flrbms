import {QueryRunner, Repository} from 'typeorm';
import {DeviceHist, Devices} from '../models';
import {CustomRepository} from '../decorators/typeorm-ex.decorator';

@CustomRepository(DeviceHist)
export class DeviceHistRepository extends Repository<DeviceHist> {
  async createNew(
    payload: Devices,
    queryRunner: QueryRunner
  ): Promise<DeviceHist> {
    const deviceId = payload.id;
    delete payload.id;
    return queryRunner.manager.save(DeviceHist, {
      deviceId: deviceId,
      type: payload.type,
      ...payload,
    });
  }
}
