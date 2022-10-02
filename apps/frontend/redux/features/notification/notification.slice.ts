import { createSlice } from '@reduxjs/toolkit';
import { fetchNotifications } from './thunk/fetch-notification';
import { Notification } from '../../../models/notification.model';
import { fetchDetailNotification } from './thunk/fetch-detail-noti';

interface InitialState {
  notifications: Notification[];
  notification: Notification;
}

const initialState: InitialState = {
  notifications: [],
  notification: {} as Notification,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    setDetailNull(state, { payload }) {
      state.notification = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, { payload }) => {
      state.notifications = payload;
    });
    builder.addCase(fetchDetailNotification.fulfilled, (state, { payload }) => {
      state.notification = payload;
    });
  },
});

export const notificationReducer = notificationSlice.reducer;
export const { setDetailNull } = notificationSlice.actions;
