import { createAsyncThunk } from '@reduxjs/toolkit';
import { Device } from '../../../models/device.model';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { axiosGetAPICall } from '../../../api-call';

interface RejectPayload {
  message: string;
}

export const fetchAllDevices = createAsyncThunk<
  Device[],
  {
    search: string;
    dir: string;
  },
  {
    rejectValue: RejectPayload;
  }
>('device/fetch-all', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(
      `${API_URL}/devices/name?search=${payload.search}&dir=${payload.dir}`
    );
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
  return await axiosGetAPICall(
    `${API_URL}/devices/name`,
    {
      search: payload.search,
      dir: payload.dir,
    },
    thunkAPI
  );
});
