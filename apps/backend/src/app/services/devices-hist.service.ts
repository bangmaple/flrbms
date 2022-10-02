import {Injectable} from "@nestjs/common";
import {DeviceHistRepository} from "../repositories";
import {DeviceHist, Devices} from "../models";
import {QueryRunner} from "typeorm";

@Injectable()
export class DeviceHistService {
  constructor(private readonly repository: DeviceHistRepository) {
  }

  async createNew(device: Devices, queryRunner: QueryRunner): Promise<DeviceHist> {
    return this.repository.createNew(device, queryRunner);
  }
}
