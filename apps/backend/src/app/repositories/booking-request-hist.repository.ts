import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {QueryRunner, Repository} from 'typeorm';
import {BookingRequest, BookingRequestHist} from '../models';

@CustomRepository(BookingRequestHist)
export class BookingRequestHistRepository extends Repository<BookingRequestHist> {
  async createNew(payload: BookingRequest, queryRunner: QueryRunner): Promise<BookingRequestHist> {
    const bookingRequestId = payload.id;
    delete payload.id
    return await queryRunner.manager.save(BookingRequestHist, {
      bookingRequestId: bookingRequestId,
      ...payload,
    });
  }
}


