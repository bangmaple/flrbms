import {createSlice} from '@reduxjs/toolkit';
import {PaginationResponse} from '../../../models/pagination-response.payload';
import {BookingRoomFeedback} from "../../../models/bookng-room-feedback.model";
import {fetchBookingRoomFeedbacks} from "./thunk/fetch-booking-room-feedbacks.thunk";
import {fetchBookingRoomFeedbackById} from "./thunk/fetch-booking-room-feedback-by-id.thunk";

interface InitialState {
  bookingRoomFeedbacks: PaginationResponse<BookingRoomFeedback>;
  bookingRoomFeedback: BookingRoomFeedback;
}

const initialState: InitialState = {
  bookingRoomFeedbacks: {} as PaginationResponse<BookingRoomFeedback>,
  bookingRoomFeedback: {} as BookingRoomFeedback,

}

export const bookingRoomFeedbackSlice = createSlice({
  name: 'bookingRoomFeedback',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBookingRoomFeedbacks.fulfilled, (state, {payload}) => {
      state.bookingRoomFeedbacks = payload;
    });
    builder.addCase(fetchBookingRoomFeedbackById.fulfilled, (state, {payload}) => {
      state.bookingRoomFeedback = payload;
    });
  },
});

export const bookingRoomFeedbackReducer = bookingRoomFeedbackSlice.reducer;
