import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { API_URL } from '../../../../constants/constant';
import { BookingRoom } from '../../../models/booking-room.model';
import { axiosGetAPICall } from '../../../api-call';

export const fetchRoomBookingById = createAsyncThunk<
  BookingRoom,
  string,
  {
    rejectValue: {
      message: string;
    };
  }
>('room-booking/fetch-room-booking-by-id', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    return await axiosGetAPICall(
      `${API_URL}/booking-room/find/${payload}`,
      undefined,
      thunkAPI
    );
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
