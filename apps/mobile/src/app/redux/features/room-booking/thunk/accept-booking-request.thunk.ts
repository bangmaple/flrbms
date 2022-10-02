import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPutAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

export const acceptBookingRequest = createAsyncThunk<
  any,
  string,
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-room/accept-booking-request', async (payload, thunkAPI) => {
  return await axiosPutAPICall(
    `${API_URL}/booking-room/accept/${payload}`,
    undefined,
    undefined,
    thunkAPI
  );
});
