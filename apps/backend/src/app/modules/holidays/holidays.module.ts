import {BookingRoomModule} from '../booking-room/booking-room.module';
import {TypeOrmExModule} from '../global/typeorm-ex.module';
import {HolidaysRepository} from '../../repositories';
import {HolidaysService} from '../../services';
import {HolidaysController} from '../../controllers';
import {forwardRef, Module} from '@nestjs/common';
import {KeycloakModule} from "../authentication";

@Module({
  imports: [
    forwardRef(() => BookingRoomModule),
    TypeOrmExModule.forCustomRepository([HolidaysRepository]),
  ],
  providers: [HolidaysService],
  exports: [HolidaysService],
  controllers: [HolidaysController],
})
export class HolidaysModule {
}
