import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosGetAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

export const fetchCurrentCheckoutInformation = createAsyncThunk(
  'room-booking/fetch-current-checkout-information',
  async (payload, thunkAPI) => {
    return await axiosGetAPICall(
      `${API_URL}/booking-room/check-out`,
      undefined,
      thunkAPI
    );
  }
);
