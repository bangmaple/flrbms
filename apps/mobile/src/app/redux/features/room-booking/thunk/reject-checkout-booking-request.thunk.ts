import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPutAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

export const rejectCheckoutBookingRequest = createAsyncThunk<
  any,
  string,
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-room/reject-checkout-booking-request', async (payload, thunkAPI) => {
  return await axiosPutAPICall(
    `${API_URL}/booking-room/reject-checkout/${payload}`,
    undefined,
    undefined,
    thunkAPI
  );
});
