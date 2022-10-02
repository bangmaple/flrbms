import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

export const fetchListRequestWithSameSlot = createAsyncThunk<
  any[],
  {
    roomId: string, 
    requestId: string
    date: string,
    checkinSlotId: string,
    checkoutSlotId: string,
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-room/list-with-same-slot', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/booking-room/list-booking-with-same-slot', {
      params: {
        roomId: payload.roomId,
        date: payload.date,
        requestId: payload.requestId,
        checkinSlotId: payload.checkinSlotId,
        checkoutSlotId: payload.checkoutSlotId,
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
