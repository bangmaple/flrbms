import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { Feedback } from '../../../../models/feedback.model';

export const rejectFeedback = createAsyncThunk<
  Feedback,
  {
    id: string;
    replyMessage: string;
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('feedbacks/reject-by-id', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.put(`api/feedbacks/reject/${payload.id}`, payload);
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
