import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {toggleSpinnerOff, toggleSpinnerOn} from '../../spinner';

export const fetchCountRequestBooking = createAsyncThunk<{ count: number }[], void, {
  rejectValue: {
    message: string
  }
}>(
  ('booking-room/fetch-count'), async (payload, thunkAPI) => {
    thunkAPI.dispatch(toggleSpinnerOn());
    try {
      const response = await axios.get(`api/booking-room/count`);
      console.log(response.data)
      return await response.data;
    } catch ({response}) {
      if (response.status === 401 || response.status === 403) {
        return thunkAPI.rejectWithValue({
          message: 'Access token is invalid'
        })
      }
    } finally {
      thunkAPI.dispatch(toggleSpinnerOff());
    }
  });
