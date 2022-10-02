import {Injectable} from '@nestjs/common';
import {RoomType, RoomTypeHist} from '../models';
import {RoomTypeHistRepository} from '../repositories/room-type-hist.repository';

@Injectable()
export class RoomTypeHistService {
  constructor(private readonly repository: RoomTypeHistRepository) {
  }

  async createNew(roomType: RoomType): Promise<RoomTypeHist> {
    return this.repository.createNew(roomType);
  }

  async deleteAllHist(id: string) {
    return this.repository.deleteAllHist(id);
  }
}
