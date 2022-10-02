import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmExModule} from '../global';
import {BookingFeedbackService} from '../../services/booking-feedback.service';
import {BookingFeedbackController} from '../../controllers';
import {AccountRepository, BookingFeedbackRepository} from '../../repositories';
import {BookingRoomModule} from './booking-room.module';
import {KeycloakModule, RolesModule} from "../authentication";

@Module({
  imports: [
    forwardRef(() => RolesModule),
    forwardRef(() => BookingRoomModule),
    TypeOrmExModule.forCustomRepository([
      BookingFeedbackRepository,
    ]),
  ],
  controllers: [BookingFeedbackController],
  providers: [BookingFeedbackService],
  exports: [BookingFeedbackService],
})
export class BookingFeedbackModule {
}
