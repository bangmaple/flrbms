import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { Feedback } from '../../../../models/feedback.model';

export const sendFeedback = createAsyncThunk<
  Feedback,
  {
    feedback?: string;
    type?: string;
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('feedback/add', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.post(`api/feedbacks/send-feedback`, {
      message: payload.feedback,
      feedbackTypeId: payload.type,
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
