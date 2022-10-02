import {createAsyncThunk} from '@reduxjs/toolkit';
import {toggleSpinnerOff, toggleSpinnerOn} from '../../spinner';
import axios from 'axios';

export const disableFeedbackTypeById = createAsyncThunk<void,
  string,
  {
    rejectValue: {
      message: string;
    };
  }>('feedback-types/disable/disable_by-id', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.put(`api/feedback-types/disable/${payload}`);
    return await response.data;
  } catch (e) {
    if (e.response.status === 401 || e.response.status === 403) {
      return thunkAPI.rejectWithValue({
        message: 'Access token is invalid',
      });
    }
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
