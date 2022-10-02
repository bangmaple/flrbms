import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosGetAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

export const fetchSlots = createAsyncThunk<any, void>(
  'slot/fetch-slots',
  async (payload, thunkAPI) => {
    return axiosGetAPICall(`${API_URL}/slots`, undefined, thunkAPI);
  }
);
