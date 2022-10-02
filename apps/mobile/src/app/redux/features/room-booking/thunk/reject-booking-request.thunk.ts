import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPutAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

export const rejectBookingRequest = createAsyncThunk<
  any,
  string,
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-room/reject-booking-request', async (payload, thunkAPI) => {
  return await axiosPutAPICall(
    `${API_URL}/booking-room/reject/${payload}`,
    undefined,
    undefined,
    thunkAPI
  );
});
