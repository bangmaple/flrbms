import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosGetAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

interface FeedbackRequestFilter {
  status?: string[];
  type?: string;
  fromDate?: string;
  toDate?: string;
}

export const fetchFeedbacks = createAsyncThunk<FeedbackFilterResponse[], FeedbackRequestFilter, {
  rejectValue: {
    message: string,
  }
}>('feedback/fetch-feedbacks', async (payload, thunkAPI) => {
  return await axiosGetAPICall(`${API_URL}/feedbacks`, {
    ...payload,
    status: JSON.stringify(payload.status)
  }, thunkAPI);
});
