import {forwardRef, Module} from '@nestjs/common';
import {BookingRoomController} from '../../controllers';
import {BookingRoomService} from '../../services';
import {BookingRoomDevicesRepository, BookingRoomRepository} from '../../repositories';
import {RoomsModule, RoomTypeModule} from '../rooms';
import {TypeOrmExModule} from '../global';
import {DevicesModule} from '../devices';
import {AccountsModule} from '../accounts';
import {BookingRequestHistService} from '../../services/booking-room-hist.service';
import {BookingRequestHistRepository} from '../../repositories/booking-request-hist.repository';
import {SlotModule} from '../slots';
import {BookingRoomDevicesService} from '../../services/booking-request-devices.service';
import {NotificationModule} from '../notifications';
import {BookingRoomGateway} from '../../gateway';
import {BookingFeedbackModule} from './booking-feedback.module';
import {HolidaysModule} from "../holidays";
import {BookingReasonModule} from "./booking-reason.module";

@Module({
  imports: [
    forwardRef(() => NotificationModule),

    forwardRef(() => AccountsModule),
    forwardRef(() => BookingReasonModule),
   RoomTypeModule,
    forwardRef(() => DevicesModule),
    forwardRef(() => RoomsModule),
    forwardRef(() => SlotModule),
    forwardRef(() => BookingFeedbackModule),
    forwardRef(() => HolidaysModule),

    TypeOrmExModule.forCustomRepository([
      BookingRoomRepository,
      BookingRequestHistRepository,
      BookingRoomDevicesRepository,
    ]),
  ],
  controllers: [BookingRoomController],
  providers: [
    BookingRoomService,
    BookingRequestHistService,
    BookingRoomDevicesService,
    BookingRoomGateway,
  ],
  exports: [
    BookingRoomService,
    BookingRequestHistService,
    BookingRoomDevicesService,
  ],
})
export class BookingRoomModule {
}
