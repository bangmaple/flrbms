import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPostAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

export const checkOutBookingRoom = createAsyncThunk<
  any,
  string,
  {
    rejectValue: {
      message: string;
    };
  }
>('room-booking/check-out-booking-room', async (payload, thunkAPI) => {
  return await axiosPostAPICall(
    `${API_URL}/booking-room/check-out/${payload}`,
    undefined,
    thunkAPI
  );
});
