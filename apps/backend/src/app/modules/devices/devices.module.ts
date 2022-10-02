import {forwardRef, Module} from '@nestjs/common';
import {DevicesController} from '../../controllers';
import {DeviceHistService, DevicesService, KeycloakService} from '../../services';
import {DeviceHistRepository, DevicesRepository} from '../../repositories';
import {HttpModule} from '@nestjs/axios';
import {TypeOrmExModule} from '../global/typeorm-ex.module';
import {AccountsModule} from '../accounts/accounts.module';
import {BookingRoomModule} from '../booking-room/booking-room.module';

@Module({
  imports: [
    forwardRef(() => BookingRoomModule),
    TypeOrmExModule.forCustomRepository([
      DevicesRepository,
      DeviceHistRepository,
    ]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService, DeviceHistService],
  exports: [DevicesService],
})
export class DevicesModule {
}
