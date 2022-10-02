import {Module} from '@nestjs/common';
import {BookingRoomController} from '../../controllers';
import {BookingRoomService} from '../../services';
import {SlotModule} from '../slots';
import {SlotService} from '../../services/slot.service';
import {BookingRoomModule} from './booking-room.module';
import {SlotController} from '../../controllers';

@Module({
  imports: [BookingRoomModule, SlotModule],
  controllers: [BookingRoomController, SlotController],
  providers: [BookingRoomService, SlotService],
  exports: [BookingRoomService, SlotService],
})
export class RequestSlotModule {
}
