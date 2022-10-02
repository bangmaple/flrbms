import {BookingRoomModule} from './booking-room.module';
import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmExModule} from '../global';
import {BookingReasonController} from '../../controllers';
import {BookingReasonService} from '../../services/booking-reason.service';
import {BookingReasonHistService} from '../../services/booking-reason-hist.service';
import {BookingReasonHistRepository, BookingReasonRepository} from '../../repositories';

@Module({
  imports: [
    forwardRef(() => BookingRoomModule),
    TypeOrmExModule.forCustomRepository([
      BookingReasonRepository,
      BookingReasonHistRepository,
    ]),
  ],
  controllers: [BookingReasonController],
  providers: [BookingReasonService, BookingReasonHistService],
  exports: [BookingReasonService, BookingReasonHistService],
})
export class BookingReasonModule {
}
