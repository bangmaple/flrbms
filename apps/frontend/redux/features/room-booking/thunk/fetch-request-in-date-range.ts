import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { RoomBooking } from '../../../../models/room-booking.model';
import dayjs from 'dayjs';

interface RejectValue {
  message: string;
}

export const fetchRequestsInDateRange = createAsyncThunk<
  RoomBooking[],
  {
    dateStart: string;
    dateEnd: string;
  },
  {
    rejectValue: RejectValue;
  }
>('booking-room/list-request-in-day-range', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.get(
      `/api/booking-room/list-request-in-day-range`,
      {
        params: {
          dateStart: dayjs(payload.dateStart).format('YYYY-MM-DD'),
          dateEnd: dayjs(payload.dateEnd).format('YYYY-MM-DD'),
        },
      }
    );
    return await response.data;
  } catch ({ response }) {
    if (response.status === 401 || response.status === 403) {
      return thunkAPI.rejectWithValue({
        message: 'Access token is invalid',
      });
    }
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
