import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';

export const cancelRoomBookingById = createAsyncThunk<
  void,
  string,
  {
    rejectValue: {
      message: string;
    };
  }
>('room-booking/cancel-room-booking-by-id', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    await axios.put(
      `${API_URL}/booking-room/current-booking/cancel/${payload}`
    );
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
