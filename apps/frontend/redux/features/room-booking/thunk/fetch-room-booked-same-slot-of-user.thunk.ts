import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import dayjs from 'dayjs';

export const IsUserHaveBookedSameSlot = createAsyncThunk<
  any[],
  {
    checkinDate: string;
    userId: string;
    timeStart: string;
    timeEnd: string;
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-room/get-room-name-booked-same-time', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(
      'api/booking-room/get-room-name-booked-same-time',
      {
        params: {
          checkinDate: dayjs(payload.checkinDate).format('YYYY-MM-DD'),
          userId: payload.userId,
          timeStart: dayjs(payload.timeStart).format('HH:mm:ss'),
          timeEnd: dayjs(payload.timeEnd).format('HH:mm:ss'),
        },
      }
    );
    console.log('LA SAO TA: ', response.data);
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
