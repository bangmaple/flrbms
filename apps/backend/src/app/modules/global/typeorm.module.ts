import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {
  AccountHist,
  AccountNotification,
  Accounts,
  BookingReasonHist,
  BookingRequest,
  BookingRequestDevices,
  BookingRequestHist,
  BookingRoomFeedback,
  DeviceHist,
  Devices,
  DeviceType,
  DeviceTypeHist,
  Feedback,
  FeedbackType,
  Holidays,
  Notification,
  RoleHist,
  Roles,
  RoomHist,
  Rooms,
  RoomType,
  RoomTypeHist,
  Slot,
} from '../../models';
import {BookingReason} from '../../models/booking-reason.entity';
import {environment} from "../../../environments/environment";

const GlobalTypeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: () => ({
    type: 'postgres',
    host: environment.database.host,
    port: environment.database.port,
    username: environment.database.username,
    password: environment.database.password,
    database: environment.database.name,
    entities: [
      Accounts,
      AccountHist,
      AccountNotification,
      BookingReason,
      BookingReasonHist,
      BookingRequest,
      BookingRequestHist,
      BookingRequestDevices,
      BookingRoomFeedback,
      Devices,
      DeviceType,
      DeviceHist,
      DeviceTypeHist,
      Feedback,
      FeedbackType,
      Notification,
      Rooms,
      RoomHist,
      RoomType,
      RoomTypeHist,
      Roles,
      RoleHist,
      Slot,
      Holidays
    ],
    synchronize: environment.database.synchronize,
    logging: ['query'],
    cache: false,
    timezone: '+7',
    extra: {
      // based on  https://node-postgres.com/api/pool
      // max connection pool size
      max: 10,
      // connection timeout
      connectionTimeoutMillis: 1000,
    },
  }),
  inject: [],
});

export default GlobalTypeOrmModule;
