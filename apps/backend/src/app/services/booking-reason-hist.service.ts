import {Injectable} from '@nestjs/common';
import {BookingReason} from '../models/booking-reason.entity';
import {BookingReasonHistRepository} from '../repositories';
import {BookingReasonHist} from '../models';

@Injectable()
export class BookingReasonHistService {
  constructor(private readonly repository: BookingReasonHistRepository) {
  }

  async createNew(bookingReason: BookingReason): Promise<BookingReasonHist> {
    return this.repository.createNew(bookingReason);
  }

  async deleteAllHist(id: string) {
    return this.repository.deleteAllHist(id);
  }
}
