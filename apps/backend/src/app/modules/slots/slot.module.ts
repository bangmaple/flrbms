import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmExModule} from '../global';
import {SlotRepository} from '../../repositories/slot.repository';
import {SlotController} from '../../controllers';
import {SlotService} from '../../services/slot.service';
import {AccountsModule} from '../accounts';
import {BookingRoomModule} from '../booking-room';

@Module({
  imports: [
    forwardRef(() => AccountsModule),
    forwardRef(() => BookingRoomModule),
    TypeOrmExModule.forCustomRepository([
      SlotRepository,
    ]),
  ],
  controllers: [SlotController],
  providers: [SlotService],
  exports: [SlotService],
})
export class SlotModule {
}
