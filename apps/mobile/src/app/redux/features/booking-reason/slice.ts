import { createSlice } from '@reduxjs/toolkit';
import { BookingRoomReason } from '../../models/booking-reason-response';
import { fetchAllBookingReason } from './thunk/fetch-all';

interface BookingReasonState {
  bookingReasons: BookingRoomReason[];
}

const initialState: BookingReasonState = {
  bookingReasons: [],
};

const bookingReasonSlice = createSlice({
  name: 'bookingReason',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllBookingReason.fulfilled, (state, { payload }) => {
      state.bookingReasons = payload;
    });
  },
});

export const bookingReasonReducer = bookingReasonSlice.reducer;
