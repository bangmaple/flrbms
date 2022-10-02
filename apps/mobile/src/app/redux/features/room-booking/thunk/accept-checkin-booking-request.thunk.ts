import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPutAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

export const acceptCheckinBookingRequest = createAsyncThunk<
  any,
  string,
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-room/accept-checkin-booking-request', async (payload, thunkAPI) => {
  return await axiosPutAPICall(
    `${API_URL}/booking-room/accept-checkin/${payload}`,
    undefined,
    undefined,
    thunkAPI
  );
});
