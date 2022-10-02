import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { Holiday } from '../../../../models/holiday.model';
import dayjs from 'dayjs';

export const fetchHolidaysMini = createAsyncThunk<
  Holiday[],
  null,
  {
    rejectValue: {
      message: string;
    };
  }
>('holiday/fetch-holidays-mini', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/holidays/mini', {});
    const formatDate = response.data.map((days) => ({
      dateStart: dayjs(days.startDate).format("YYYY-MM-DD"),
      dateEnd: dayjs(days.endDate).format("YYYY-MM-DD")
    }))
    return await formatDate;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
