import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../features/spinner';
import axios from 'axios';
import { defaultPaginationParams } from '../../../models/pagination-params.model';
import { fetchDeviceTypes } from '../../features/device-type';

export const addDeviceType = createAsyncThunk<
  void,
  {
    name?: string;
    description?: string;
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('device-type/add', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.post(`api/device-type`, {
      name: payload.name,
      description: payload.description,
    });
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
    thunkAPI.dispatch(fetchDeviceTypes(defaultPaginationParams));
  }
});
