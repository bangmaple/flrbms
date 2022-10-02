import {Module} from '@nestjs/common';
import {FeedbackService,} from '../../services';
import {TypeOrmExModule} from '../global';
import {FeedbackRepository} from '../../repositories';
import {FeedbackController} from '../../controllers';
import {AccountsModule} from '../accounts';
import {NotificationModule} from '../notifications';
import {FeedbackGateway} from '../../gateway';

@Module({
  imports: [
    AccountsModule,
    NotificationModule,
    TypeOrmExModule.forCustomRepository([
      FeedbackRepository,
    ]),
  ],
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    FeedbackGateway,
  ],
  exports: [FeedbackService],
})
export class FeedbackModule {
}
