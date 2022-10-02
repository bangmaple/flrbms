import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { PaginationResponse } from '../../../../models/pagination-response.payload';
import { PaginationParams } from '../../../../models/pagination-params.model';
import { DeviceType } from '../../../../models/device-type.model';

export const fetchDeviceTypes = createAsyncThunk<
  PaginationResponse<DeviceType>,
  PaginationParams,
  {
    rejectValue: {
      message: string;
    };
  }
>('device-type/fetch-device-types', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/device-type', {
      params: {
        page: payload.page,
        limit: payload.limit,
        search: payload.search,
        sort: payload.sort,
        dir: payload.dir,
      },
    });
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
