import {createAsyncThunk} from '@reduxjs/toolkit';
import {toggleSpinnerOff, toggleSpinnerOn} from '../../spinner';
import axios from 'axios';

export const fetchFeedbackTypeNames = createAsyncThunk<any[],
  void,
  {
    rejectValue: {
      message: string;
    };
  }>('feedback-types/fetch-feedback-type-names', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/feedback-types/name');
    const result = await response.data.map(feedbacktype => ({
      value: feedbacktype.id,
      label: feedbacktype.name
    }))
    return await result;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});



