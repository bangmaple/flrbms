import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

export const fetchHolidaysByName = createAsyncThunk<
  any[],
  void,
  {
    rejectValue: {
      message: string;
    };
  }
  >('holidays/fetch-holidays-by-name', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/holidays/name');
    const result = await response.data.map(holiday => ({
      value: holiday.id,
      label: holiday.name
    }))
    return await result;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});



