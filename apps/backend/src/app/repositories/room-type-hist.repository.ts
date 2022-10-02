import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {Repository} from 'typeorm';
import {RoomType, RoomTypeHist} from '../models';

@CustomRepository(RoomTypeHist)
export class RoomTypeHistRepository extends Repository<RoomTypeHist> {
  async createNew(payload: RoomType): Promise<RoomTypeHist> {
    const roomTypeId = payload.id;
    delete payload.id
    return this.save({
      roomTypeId: roomTypeId,
      ...payload,
    });
  }

  async deleteAllHist(id: string) {
    return await this.createQueryBuilder('room_type_hist')
      .delete()
      .where('room_type_hist.room_type_id = :id', {id: id})
      .useTransaction(true)
      .execute();
  }
}
