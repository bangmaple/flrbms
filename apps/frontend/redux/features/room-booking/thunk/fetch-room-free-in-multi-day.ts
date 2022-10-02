import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import dayjs from 'dayjs';

export const fetchRoomFreeAtMultiDay = createAsyncThunk<
  any[],
  {
    search: string;
    checkinDate: string;
    checkoutDate: string;
    checkinTime: string;
    checkoutTime: string;
    capacity: number
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-room/list-room-free-at-multi-date', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(
      'api/booking-room/list-room-free-at-multi-date-v2',
      {
        params: {
          search: payload.search,
          dateStart: dayjs(payload.checkinDate).format('YYYY-MM-DD'),
          dateEnd: dayjs(payload.checkoutDate).format('YYYY-MM-DD'),
          checkinTime: dayjs(payload.checkinTime).format('HH:mm:ss'),
          checkoutTime: dayjs(payload.checkoutTime).format('HH:mm:ss'),
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
