import {forwardRef, Module} from '@nestjs/common';
import {DeviceTypeController} from '../../controllers';
import {DeviceTypeService} from '../../services/device-type.service';
import {TypeOrmExModule} from '../global';
import {DeviceTypeRepository} from '../../repositories/device-type.repository';
import {DeviceTypeHistRepository} from '../../repositories/device-type-hist.repository';
import {DeviceTypeHistService} from '../../services/device-type-hist.service';
import {DevicesModule} from './devices.module';

@Module({
  imports: [
   DevicesModule,
    TypeOrmExModule.forCustomRepository([
      DeviceTypeRepository,
      DeviceTypeHistRepository,
    ]),
  ],
  controllers: [DeviceTypeController],
  exports: [DeviceTypeService, DeviceTypeHistService],
  providers: [DeviceTypeService, DeviceTypeHistService],
})
export class DeviceTypeModule {
}
