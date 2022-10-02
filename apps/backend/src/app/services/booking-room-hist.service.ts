import {Injectable} from '@nestjs/common';
import {QueryRunner} from 'typeorm';
import {BookingRequest, BookingRequestHist} from '../models';
import {BookingRequestHistRepository} from '../repositories/booking-request-hist.repository';

@Injectable()
export class BookingRequestHistService {
  constructor(private readonly repository: BookingRequestHistRepository) {
  }

  async createNew(request: BookingRequest, queryRunner: QueryRunner): Promise<BookingRequestHist> {
    return this.repository.createNew(request, queryRunner);
  }
}
