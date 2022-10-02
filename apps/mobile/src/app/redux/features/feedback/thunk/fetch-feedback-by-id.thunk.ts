import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosGetAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';
import { FeedbackModel } from '../../../models/feedback.model';

export const fetchFeedbackById = createAsyncThunk<
  FeedbackModel,
  string,
  {
    rejectValue: {
      message: string;
    };
  }
>('feedback/fetch-by-id', async (payload, thunkAPI) => {
  return await axiosGetAPICall(
    `${API_URL}/feedbacks/${payload}`,
    undefined,
    thunkAPI
  );
});
