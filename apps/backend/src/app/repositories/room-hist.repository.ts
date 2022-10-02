import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {QueryRunner, Repository} from 'typeorm';
import {RoomHist, Rooms} from '../models';

@CustomRepository(RoomHist)
export class RoomHistRepository extends Repository<RoomHist> {
  async createNew(payload: Rooms, queryRunner: QueryRunner): Promise<RoomHist> {
    const roomId = payload.id;
    delete payload.id
    return queryRunner.manager.save(RoomHist, {
      roomId: roomId,
      ...payload,
    });
  }
}
