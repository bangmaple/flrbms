import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPutAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

interface CancelRoomBookingPayload {
  id: string;
  reason: string;
}

export const cancelBookingRoom = createAsyncThunk<void, CancelRoomBookingPayload, {
  rejectValue: {
    message: string;
  }
}>("booking-room/cancel-booking", async (payload, thunkAPI) => {
  return await axiosPutAPICall(`${API_URL}/booking-room/cancel/${payload.id}`, {
    reason: payload.reason
  }, undefined, thunkAPI);
});





