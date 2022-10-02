import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPutAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';
interface RejectCheckinBookingRequestPayload {
  id: string;
  reason: string;
}
export const rejectCheckinBookingRequest = createAsyncThunk<
  any,
  RejectCheckinBookingRequestPayload,
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-room/reject-checkin-booking-request', async (payload, thunkAPI) => {
  return await axiosPutAPICall(
    `${API_URL}/booking-room/reject-checkin/${payload.id}`,
    { reason: payload.reason },
    undefined,
    thunkAPI
  );
});
