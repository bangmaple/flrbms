import {Injectable} from '@nestjs/common';
import {DeviceType, DeviceTypeHist} from '../models';
import {DeviceTypeHistRepository} from '../repositories/device-type-hist.repository';

@Injectable()
export class DeviceTypeHistService {
  constructor(private readonly repository: DeviceTypeHistRepository) {
  }

  async createNew(deviceType: DeviceType): Promise<DeviceTypeHist> {
    return this.repository.createNew(deviceType);
  }

  async deleteAllHist(id: string) {
    return this.repository.deleteAllHist(id);
  }
}
