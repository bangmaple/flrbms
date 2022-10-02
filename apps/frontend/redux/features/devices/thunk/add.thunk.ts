import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

interface AddPayload {
  name: string;
  description: string;
}

interface RejectValue {
  message: string;
}

export const addDevice = createAsyncThunk<
  void,
  AddPayload,
  {
    rejectValue: RejectValue;
  }
>('device/add-device', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.post(`/api/devices/add`, payload);
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
