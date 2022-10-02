import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { Feedback } from '../../../../models/feedback.model';

export const fetchFeedbackById = createAsyncThunk<
  Feedback,
  string,
  {
    rejectValue: {
      message: string;
    };
  }
>('feedback/fetch-by-id', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(`api/feedbacks/${payload}`);
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
