import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import dayjs from 'dayjs';

export const fetchRoomFreeAtTime = createAsyncThunk<
  any[],
  {
    search: string;
    date: string;
    timeStart: string;
    timeEnd: string;
    capacity: number;
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-room/list-room-free-at-time', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(
      'api/booking-room/list-room-free-at-time',
      {
        params: {
          search: payload.search,
          date: dayjs(payload.date).format('YYYY-MM-DD'),
          checkinTime: dayjs(payload.timeStart).format("HH:mm:ss"),
          checkoutTime: dayjs(payload.timeEnd).format("HH:mm:ss"),
          capacity: payload.capacity
        },
      }
    );
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
