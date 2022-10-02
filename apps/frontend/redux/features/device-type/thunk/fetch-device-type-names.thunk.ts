import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

export const fetchDeviceTypeNames = createAsyncThunk<
any[],
void,
{
  rejectValue: {
    message: string;
  };
}
>('device-type/fetch-device-type-names', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/device-type/name');
    const result = await response.data.map(roomtype => ({
      value: roomtype.id,
      label: roomtype.name
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



