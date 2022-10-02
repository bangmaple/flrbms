import {createAsyncThunk} from '@reduxjs/toolkit';
import {toggleSpinnerOff, toggleSpinnerOn} from '../../spinner';
import axios from 'axios';
import {Holiday} from "../../../../models/holiday.model";

export const fetchHolidayById = createAsyncThunk<Holiday,
  string,
  {
    rejectValue: {
      message: string;
    };
  }>('holiday/fetch-holiday-by-id', async (id, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(`/api/holidays/find/${id}`);
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
