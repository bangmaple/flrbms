import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { BookingRoomReason } from '../../../models/booking-reason-response';

interface RejectPayload {
  message: string;
};

export const fetchAllBookingReason = createAsyncThunk<BookingRoomReason[], void, {
  rejectValue: RejectPayload
}>("bookingReason/fetch-all", async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(`${API_URL}/booking-reasons/name`);
    return response.data
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
