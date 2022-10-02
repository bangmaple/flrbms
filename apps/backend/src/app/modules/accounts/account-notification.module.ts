import {Module} from '@nestjs/common';
import {TypeOrmExModule} from '../global';
import {AccountNotificationRepository} from '../../repositories/account-notification.repository';
import {AccountNotificationService} from '../../services/account-notification.service';
import {AccountNotificationController} from '../../controllers';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([AccountNotificationRepository]),
  ],
  controllers: [AccountNotificationController],
  providers: [AccountNotificationService],
  exports: [AccountNotificationService],
})
export class AccountNotificationModule {
}
