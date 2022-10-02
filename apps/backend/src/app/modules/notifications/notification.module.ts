import {NotificationController} from '../../controllers/notification.controller';
import {forwardRef, Module} from '@nestjs/common';
import {NotificationService} from '../../services';
import {TypeOrmExModule} from '../global';
import {AccountNotificationModule, AccountsModule} from '../accounts';
import {NotificationRepository} from '../../repositories/notification.repository';

@Module({
  imports: [
    AccountNotificationModule,
    forwardRef(() => AccountsModule),

    TypeOrmExModule.forCustomRepository([NotificationRepository]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {
}
