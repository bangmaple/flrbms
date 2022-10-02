import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

export const fetchDeviceNames = createAsyncThunk<
  { value: string; label: string }[],
  void,
  {
    rejectValue: {
      message: string;
    };
  }
>('device/fetch-device-names', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/devices/name');
    const result = await response.data.map((device) => ({
      value: device.id,
      label: device.name,
    }));
    return await result;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
