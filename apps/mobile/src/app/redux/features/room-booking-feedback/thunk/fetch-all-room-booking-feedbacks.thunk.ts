import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosGetAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';
import { RoomBookingFeedback } from '../../../models/room-booking-feedback.model';

interface RequestPayload {
  star: number[];
  roomId: string;
  feedbackTypeId: string;
  fromDate: string;
  toDate: string;
}

export const fetchRoomBookingFeedbacks = createAsyncThunk<
  RoomBookingFeedback[],
  RequestPayload,
  {
    rejectValue: {
      message: string;
    };
  }
>('room-booking-feedback/fetch-all-booking-room-feedbacks', async (payload, thunkAPI) => {
  return  axiosGetAPICall(
    `${API_URL}/booking-room-feedbacks`,
    {
      star: JSON.stringify(payload.star),
      type: payload.feedbackTypeId,
      roomId: payload.roomId,
      fromDate: payload.fromDate,
      toDate: payload.toDate,
    },
    thunkAPI
  );
});
