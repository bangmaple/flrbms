import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {Repository} from 'typeorm';
import {DeviceType, DeviceTypeHist} from '../models';

@CustomRepository(DeviceTypeHist)
export class DeviceTypeHistRepository extends Repository<any> {
  async createNew(payload: DeviceType): Promise<DeviceTypeHist> {
    const deviceTypeId = payload.id;
    delete payload.id;
    const data = await this.save({
      deviceTypeId: deviceTypeId,
      ...payload,
    });
    return data;
  }

  async deleteAllHist(id: string) {
    return await this.createQueryBuilder('device_type_hist')
      .delete()
      .where('device_type_hist.device_type_id = :id', {id: id})
      .useTransaction(true)
      .execute();
  }
}
