import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

export const updateBackendConfig = createAsyncThunk<
  void,
  {
    maxBookingDateRange: number;
    maxDeviceBorrowQuantity: number;
    maxBookingRequestPerWeek: number;
    maxRoomCapacity: number;
  },
  any
>('system/update-backend-config', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.post('api/config', {
      maxBookingDateRange: payload.maxBookingDateRange,
      maxDeviceBorrowQuantity: payload.maxDeviceBorrowQuantity,
      maxBookingRequestPerWeek: payload.maxBookingRequestPerWeek,
      maxRoomCapacity: payload.maxRoomCapacity
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
