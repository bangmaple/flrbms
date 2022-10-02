import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { defaultPaginationParams } from '../../../../models/pagination-params.model';
import { fetchBookingReasons } from './fetch-booking-reasons.thunk';

export const updateBookingReasonById = createAsyncThunk<
  void,
  {
    id?: string;
    name?: string;
    description?: string;
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-reason/update-by-id', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.put(`api/booking-reasons/${payload.id}`, {
      id: payload.id,
      name: payload.name,
      description: payload.description,
    });
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
    thunkAPI.dispatch(fetchBookingReasons(defaultPaginationParams));
  }
});
