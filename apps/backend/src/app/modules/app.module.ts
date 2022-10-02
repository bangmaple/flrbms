import {DynamicModule, Global, Scope} from '@nestjs/common';

import {KeycloakModule} from './authentication';
import {RoomsModule} from './rooms';
import {HealthCheckModule} from './utils/health-check.module';
import {AccountsModule} from './accounts';
import {DevicesModule} from './devices';
import GlobalTypeOrmModule from './global/typeorm.module';
import {HttpModule} from '@nestjs/axios';
import {BookingFeedbackModule, BookingReasonModule, BookingRoomModule} from './booking-room';
import {APP_GUARD} from '@nestjs/core';
import {RolesModule} from './authentication';
import {RoomTypeModule} from './rooms';
import {DeviceTypeModule} from './devices';
import {SlotModule} from './slots';
import {FeedbackModule, FeedbackTypeModule} from './feedbacks';
import {NotificationModule} from './notifications';
import {AppConfigModule} from "./common";
import {HolidaysModule} from "./holidays";
import {AuthenticationModule} from "./authentication/authentication.module";
import {RolesGuard} from "../guards";

@Global()
export class AppModule {
  static forRoot(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        GlobalTypeOrmModule,
        HttpModule,
        HealthCheckModule,
        KeycloakModule,
        AuthenticationModule,
        AppConfigModule,
        RoomsModule,
        AccountsModule,
        FeedbackModule,
        BookingFeedbackModule,
        FeedbackTypeModule,
        NotificationModule,
        DevicesModule,
        BookingRoomModule,
        RoomTypeModule,
        DeviceTypeModule,
        BookingReasonModule,
        RolesModule,
        SlotModule,
        HolidaysModule,
      ],
      controllers: [],
      exports: [],
      providers: [
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
          scope: Scope.REQUEST,
        },
      ],
    };
  }
}
