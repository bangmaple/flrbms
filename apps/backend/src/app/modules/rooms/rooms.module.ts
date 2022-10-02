import {forwardRef, Module} from '@nestjs/common';
import {RoomsController} from '../../controllers';
import {RoomsService} from '../../services';
import {RoomsRepository} from '../../repositories';
import {TypeOrmExModule} from '../global';
import {RoomHistRepository} from '../../repositories/room-hist.repository';
import {RoomHistService} from '../../services/room-hist.service';
import {BookingRoomModule} from '../booking-room';

@Module({
  imports: [
    forwardRef(() => BookingRoomModule),
    TypeOrmExModule.forCustomRepository([RoomsRepository, RoomHistRepository]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomHistService],
  exports: [RoomsService, RoomHistService],
})
export class RoomsModule {
}
