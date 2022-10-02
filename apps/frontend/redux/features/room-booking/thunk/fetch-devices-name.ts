import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';


interface FetchDevicesRejectPayload {
  message: string;
}

export const fetchDevicesName = createAsyncThunk<
  { id: string; name: string }[],
  void,
  {
    rejectValue: FetchDevicesRejectPayload;
  }
>('room/fetch-devices-name', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(`api/booking-room/devices?name=&type=&sort=ASC`, {});
    const dataReturn = response.data.map((value) => ({
      value: value.id,
      label: value.name,
    }));
    return await dataReturn;
  } catch ({ response }) {
    if (response.status === 401 || response.status === 403) {
      return thunkAPI.rejectWithValue({
        message: 'Access token is invalid',
      });
    }
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
