import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import {createWrapper, HYDRATE} from 'next-redux-wrapper';
import logger from 'redux-logger';
import spinnerSlice from './features/spinner/slice';
import {authReducer} from './features/account/auth.slice';
import {roomReducer} from './features/room/room.slice';
import {roomBookingReducer} from './features/room-booking/room-booking.slice';
import {systemReducer} from './features/system/system.slice';
import {devicesReducer} from './features/devices/devices.slice';
import {accountReducer} from './features/account/account.slice';
import {roomTypeReducer} from './features/room-type';
import {deviceTypeReducer} from './features/device-type';
import {roleReducer} from './features/role';
import {bookingReasonReducer} from './features/booking-reason';
import {notificationReducer} from './features/notification/notification.slice';
import {feedbackReducer} from './features/feedback/feedback.slice';
import {feedbackTypeReducer} from './features/feedback-type/feedback-type.slice'
import {bookingRoomFeedbackReducer} from './features/booking-room-feedback/booking-room-feedback.slice'
import {holidayReducer} from "./features/holidays/holiday.slice";
import { slotReducer } from './features/slot';

const isProduction = process.env.NODE_ENV === 'production';

const combinedReducer = combineReducers({
  spinner: spinnerSlice.reducer,
  auth: authReducer,
  room: roomReducer,
  device: devicesReducer,
  roomBooking: roomBookingReducer,
  system: systemReducer,
  account: accountReducer,
  roomType: roomTypeReducer,
  notification: notificationReducer,
  feedback: feedbackReducer,
  deviceType: deviceTypeReducer,
  role: roleReducer,
  bookingReason: bookingReasonReducer,
  feedbackType: feedbackTypeReducer,
  bookingRoomFeedback: bookingRoomFeedbackReducer,
  slot: slotReducer,
  holiday: holidayReducer
});

const reducer = (
  state: ReturnType<typeof combinedReducer>,
  action: AnyAction
) => {
  if (action.type === HYDRATE) {
    return {
      ...state, //use previous state
      ...action.payload, //apply delta from hydration
    };
  } else {
    return combinedReducer(state, action);
  }
};

export const makeStore = () => {
  return configureStore({
    reducer,
    devTools: !isProduction,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  });
};

type Store = ReturnType<typeof makeStore>;

export type AppDispatch = Store['dispatch'];
export type RootState = ReturnType<typeof combinedReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
  RootState,
  unknown,
  Action<string>>;

export const wrapper = createWrapper(makeStore, {debug: !isProduction});
