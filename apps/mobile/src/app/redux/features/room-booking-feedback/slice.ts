import { createSlice } from '@reduxjs/toolkit';
import { RoomBookingFeedback } from '../../models/room-booking-feedback.model';
import { fetchRoomBookingFeedbacks } from './thunk/fetch-all-room-booking-feedbacks.thunk';
import { fetchRoomBookingFeedback } from './thunk/fetch-room-booking-feedback.thunk';

interface InitialState {
  roomBookingFeedbacks: RoomBookingFeedback[];
  roomBookingFeedback: RoomBookingFeedback;
}

const initialState: InitialState = {
  roomBookingFeedbacks: [],
  roomBookingFeedback: {} as RoomBookingFeedback,
};

const roomBookingFeedbackSlice = createSlice({
  name: 'room-booking-feedback',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchRoomBookingFeedbacks.fulfilled,
      (state, { payload }) => {
        state.roomBookingFeedbacks = payload;
      }
    );
    builder.addCase(
      fetchRoomBookingFeedback.fulfilled,
      (state, { payload }) => {
        state.roomBookingFeedback = payload;
      }
    );
  },
});

export const roomBookingFeedbackReducer = roomBookingFeedbackSlice.reducer;
