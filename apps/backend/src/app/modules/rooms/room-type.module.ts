import {forwardRef, Module} from '@nestjs/common';
import {RoomTypeService} from '../../services/room-type.service';
import {RoomTypeController} from '../../controllers';
import {TypeOrmExModule} from '../global';
import {RoomTypeRepository} from '../../repositories/room-type.repository';
import {RoomTypeHistService} from '../../services/room-type-hist.service';
import {RoomTypeHistRepository} from '../../repositories/room-type-hist.repository';
import {RoomsModule} from './rooms.module';

@Module({
  imports: [
     RoomsModule,
    TypeOrmExModule.forCustomRepository([
      RoomTypeRepository,
      RoomTypeHistRepository,
    ]),
  ],
  controllers: [RoomTypeController],
  exports: [RoomTypeService, RoomTypeHistService],
  providers: [RoomTypeService, RoomTypeHistService],
})
export class RoomTypeModule {
}
