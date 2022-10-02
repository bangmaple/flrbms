import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosGetAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';
import { CurrentCheckinInformation } from '../../../models/current-checkin-information.model';

export const fetchCurrentCheckinInformation = createAsyncThunk<
  CurrentCheckinInformation,
  void,
  {
    rejectValue: {
      message: string;
    };
  }
>(
  'room-booking/fetch-current-checkin-information',
  async (payload, thunkAPI) => {
    return await axiosGetAPICall(
      `${API_URL}/booking-room/check-in`,
      undefined,
      thunkAPI
    );
  }
);
