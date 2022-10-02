import {forwardRef, Module} from '@nestjs/common';
import {AccountsController} from '../../controllers';
import {AccountsService} from '../../services';
import {AccountHistRepository, AccountRepository} from '../../repositories';
import {TypeOrmExModule} from '../global';
import {AccountHistService} from '../../services/account-hist.service';
import {BookingRoomModule} from '../booking-room';
import {RolesModule} from '../authentication';
import {KeycloakModule} from "../authentication";
import {CloudinaryModule} from "../common";

@Module({
  imports: [
    CloudinaryModule,
    KeycloakModule,
    forwardRef(() => BookingRoomModule),
    forwardRef(() => RolesModule),

    TypeOrmExModule.forCustomRepository([
      AccountRepository,
      AccountHistRepository,
    ]),
  ],
  controllers: [AccountsController],
  providers: [
    AccountsService,
    AccountHistService,
  ],
  exports: [
    AccountsService,
    AccountHistService
  ],
})
export class AccountsModule {
}
