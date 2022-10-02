import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { API_URL } from '../../../../constants/constant';
import AddNewFeedbackResponseModel from '../../../models/add-new-feedback-response.model';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';

interface RequestPayload {
  message: string;
  feedbackTypeId: string;
}

interface RejectValue {
  message: string;
}

export const addNewFeedback = createAsyncThunk<
  AddNewFeedbackResponseModel,
  RequestPayload,
  {
    rejectValue: RejectValue;
  }
>('feedback/send-feedback', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.post(
      `${API_URL}/feedbacks/send-feedback`,

      {
        message: payload.message,
        feedbackTypeId: payload.feedbackTypeId,
      },
      {
        headers: {
          Authorization: `Bearer ${LOCAL_STORAGE.getString('accessToken')}`,
        },
      }
    );
    return await response.data;
  } catch (e: AxiosError | any) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
