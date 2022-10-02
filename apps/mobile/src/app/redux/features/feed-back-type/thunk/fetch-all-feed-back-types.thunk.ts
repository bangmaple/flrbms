import { createAsyncThunk } from '@reduxjs/toolkit';
import { Slot } from '../../../models/slot.model';
import { axiosGetAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

export const fetchAllFeedBackTypes = createAsyncThunk<Slot[], void>(
  'feedbackType/fetch-all-feedbackTypes',
  async (payload, thunkAPI) => {
    return axiosGetAPICall(
      `${API_URL}/feedback-types/name`,
      undefined,
      thunkAPI
    );
  }
);
