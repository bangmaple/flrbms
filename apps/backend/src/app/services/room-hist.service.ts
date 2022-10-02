import {Injectable} from '@nestjs/common';
import {QueryRunner} from 'typeorm';
import {RoomHist, Rooms} from '../models';
import {RoomHistRepository} from '../repositories/room-hist.repository';

@Injectable()
export class RoomHistService {
  constructor(private readonly repository: RoomHistRepository) {
  }

  async createNew(room: Rooms, queryRunner: QueryRunner): Promise<RoomHist> {
    return this.repository.createNew(room, queryRunner);
  }
}
