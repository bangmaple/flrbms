import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../../../constants/constant';
import {axiosGetAPICall} from "../../../api-call";

export const fetchLastBookingDate = createAsyncThunk<{ startDate: string; endDate: string },
  void,
  {
    rejectValue: {message: string};
  }
  >('room-booking/fetch-last-booking-day', async (payload, thunkAPI) => {
    return axiosGetAPICall(`${API_URL}/config/room-booking-date-limit`, undefined, thunkAPI);
});
