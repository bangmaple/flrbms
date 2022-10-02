import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { PagingParams } from '../../../../models/pagination-params/paging-params.model';
import { PaginationResponse } from '../../../../models/pagination-response.payload';
import { Device } from '../../../../models/device.model';


interface FetchDevicesRejectPayload {
  message: string;
}

export const fetchDevices = createAsyncThunk<
  PaginationResponse<Device>,
  PagingParams,
  {
    rejectValue: FetchDevicesRejectPayload;
  }
>('device/fetch-devices', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(`api/devices`, {
      params: {
        page: payload.page,
        search: payload.search,
        dir: payload.dir,
        limit: payload.limit,
        sort: payload.sort,
      },
    });
    return await response.data;
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
