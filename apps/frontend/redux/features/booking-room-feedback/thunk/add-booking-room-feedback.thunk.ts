import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

export const addBookingRoomFeedback = createAsyncThunk<
  void,
  {
    feedback?: string;
    bookingRoomId?: string;
    rateNum?: number;
    type?: string;
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-room-feedback/add', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.post(
      `api/booking-room-feedbacks/send-feedback`,
      {
        message: payload.feedback,
        rateNum: payload.rateNum,
        type: payload.type,
        bookingRoomId: payload.bookingRoomId,
      }
    );
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
