import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosGetAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

export const fetchAllBookingRoomHistory = createAsyncThunk<
  any[],
  {
    roomName: string;
    slotStart: number;
    slotEnd: number;
    dateStart: string;
    dateEnd: string;
  }
>('room-booking/fetch-all-booking-room-history', async (payload, thunkAPI) => {
  return await axiosGetAPICall(
    `${API_URL}/booking-room/history`,
    payload,
    thunkAPI
  );
});
