import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPostAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

interface AttemptCheckoutBookingRoomRequestPayload {
  id: string;
  signature: string;
}
export const attemptCheckoutBookingRoom = createAsyncThunk<
  void,
  AttemptCheckoutBookingRoomRequestPayload,
  {
    rejectValue: {
      message: string;
    };
  }
>('room-booking/attempt-checkout', async (payload, thunkAPI) => {
  return await axiosPostAPICall(
    `${API_URL}/booking-room/attempt-checkout/${payload.id}`,
    {
      signature: payload.signature,
    },
    thunkAPI
  );
});
