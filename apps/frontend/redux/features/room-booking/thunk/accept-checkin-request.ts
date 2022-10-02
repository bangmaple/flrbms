import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { RoomBooking } from '../../../../models/room-booking.model';

export const acceptCheckinRequest = createAsyncThunk<
  RoomBooking,
  string,
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-room/accept-checkin-booking-request', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.put(`api/booking-room/accept-checkin/${payload}`);
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
