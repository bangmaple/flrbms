import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios, { AxiosError } from 'axios';
import { API_URL } from '../../../../constants/constant';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';

interface RequestPayload {
  message: string;
  rateNum: number;
  bookingRoomId: string;
  feedbackType: string;
}

interface FeedbackResponse {
  feedbackMessage: string
  rateNum: number
  bookingRoomId: string
  createdBy: string
  createdAt: string
  id: string
}

interface RejectValue {
  message: string
}

export const addNewFeedbackAfterCheckout = createAsyncThunk<
  FeedbackResponse,
  RequestPayload,
  {
    rejectValue: RejectValue;
  }
  >('feedback/send-feedback-after-checkout', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.post(
      `${API_URL}/booking-room-feedbacks/send-feedback`,
      {
        message: payload.message,
        type: payload.feedbackType,
        rateNum: payload.rateNum,
        bookingRoomId: payload.bookingRoomId
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
