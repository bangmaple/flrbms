import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import dayjs from 'dayjs';

export const IsUserHaveBookedSameSlotMulti = createAsyncThunk<
  any[],
  {
    checkinDate: string, 
    checkoutDate: string, 
    userId: string
    checkinTime: string,
    checkoutTime: string,
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-room/get-room-name-booked-same-slot-multi', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    console.log(payload)
    const response = await axios.get('api/booking-room/get-room-name-booked-same-slot-multi', {
      params: {
        checkinDate: dayjs(payload.checkinDate).format('YYYY-MM-DD'),
        checkoutDate: dayjs(payload.checkoutDate).format('YYYY-MM-DD'),
        userId: payload.userId,
        checkinTime: dayjs(payload.checkinTime).format('HH:mm:ss'),
        checkoutTime: dayjs(payload.checkoutTime).format('HH:mm:ss'),
      },
    });
    console.log("LA SAO TA: ",response.data);
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
