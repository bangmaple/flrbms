import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { defaultPaginationParams } from '../../../../models/pagination-params.model';
import { fetchFeedbackTypes } from './fetch-feedback-types.thunk';

export const addFeedbackType = createAsyncThunk<
  void,
  {
    name?: string;
    description?: string;
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('feedback-types/add', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.post(`api/feedback-types`, {
      name: payload.name,
      description: payload.description,
    });
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
    thunkAPI.dispatch(fetchFeedbackTypes(defaultPaginationParams));
  }
});
