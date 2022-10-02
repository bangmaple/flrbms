import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { API_URL } from '../../../../constants/constant';
import { BookedRequest } from '../../../models/booked-request.model';

interface RequestPayload {
  description: string;
  bookingReasonId: string;
  requests: any;
}

interface RejectValue {
  message: string;
}

export const performAutoBooking = createAsyncThunk<
  any,
  RequestPayload,
  {
    rejectValue: RejectValue;
  }
  >('room-booking/auto-booking', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.post(
      `${API_URL}/booking-room/auto-booking`,
      {
        description: payload.description,
        bookingReasonId: payload.bookingReasonId,
        bookingRequests: payload.requests
      }
    );
    return await response.data;
  } catch (e: AxiosError | any) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
