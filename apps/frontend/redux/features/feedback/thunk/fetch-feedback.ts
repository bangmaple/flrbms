import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { PaginationResponse } from '../../../../models/pagination-response.payload';
import { Feedback } from '../../../../models/feedback.model';
import { FeedbackPaginationParams } from '../../../../models/pagination-params/feedback-paging-params.model';

export const fetchFeedbacks = createAsyncThunk<
  PaginationResponse<Feedback>,
  FeedbackPaginationParams,
  {
    rejectValue: {
      message: string;
    };
  }
>('feedback/fetch-feedbacks', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/feedbacks', {
      params: {
        page: payload.page,
        limit: payload.limit,
        search: payload.search,
        status: payload.status,
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
