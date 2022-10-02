import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

export const restoreDeletedDeviceTypeById = createAsyncThunk<
  void,
  string,
  {
    rejectValue: {
      message: string;
    };
  }
>('device-type/restore-deleted-by-id', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.put(
      `api/device-type/restore-deleted/${payload}`
    );
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
