import {createAsyncThunk} from '@reduxjs/toolkit';
import {toggleSpinnerOff, toggleSpinnerOn} from '../../spinner';
import axios from 'axios';

export const restoreDisabledFeedbackTypeById = createAsyncThunk<void,
  string,
  {
    rejectValue: {
      message: string;
    };
  }>('feedback-types/restore-disabled/restored-disabled-id', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.put(
      `api/feedback-types/restore-disabled/${payload}`
    );
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
