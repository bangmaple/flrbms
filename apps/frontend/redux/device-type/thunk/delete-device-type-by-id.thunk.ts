import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../features/spinner';
import axios from 'axios';

export const deleteDeviceTypeById = createAsyncThunk<
  void,
  string,
  {
    rejectValue: {
      message: string;
    };
  }
>('device-type/delete-by-id', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.delete(`api/device-type/${payload}`);
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
