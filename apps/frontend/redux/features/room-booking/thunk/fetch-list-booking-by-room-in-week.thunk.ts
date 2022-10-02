import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

export const fetchListBookingByRoomInWeek = createAsyncThunk<
  any[],
  {
    roomId: string,
    date: string,
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-room/by-room-in-week', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/booking-room/list-booking-by-room-in-week', {
      params: {
        roomId: payload.roomId,
        date: payload.date,
      },
    });
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
