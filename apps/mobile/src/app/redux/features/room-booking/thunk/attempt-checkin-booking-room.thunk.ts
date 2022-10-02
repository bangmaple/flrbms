import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPostAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

interface AttemptCheckinBookingRoomRequestPayload {
  id: string;
}
export const attemptCheckinBookingRoom = createAsyncThunk<
  void,
  AttemptCheckinBookingRoomRequestPayload,
  {
    rejectValue: {
      message: string;
    };
  }
  >('room-booking/attempt-checkin', async (payload, thunkAPI) => {
  return await axiosPostAPICall(
    `${API_URL}/booking-room/attempt-checkin/${payload.id}`,
    {},
    thunkAPI
  );
});
