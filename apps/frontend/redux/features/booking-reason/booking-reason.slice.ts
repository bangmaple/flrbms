import { fetchReasonNames } from './thunk/fetch-booking-reason-names.thunk';
import { createSlice } from '@reduxjs/toolkit';
import { PaginationResponse } from '../../../models/pagination-response.payload';

import { BookingReason } from '../../../models/booking-reason.model';
import { fetchBookingReasonById } from './thunk/fetch-booking-reason-by-id.thunk';
import { fetchBookingReasons } from './thunk/fetch-booking-reasons.thunk';
import { fetchDeletedBookingReasons } from './thunk/fetch-deleted.thunk';

interface InitialState {
  bookingReasons: PaginationResponse<BookingReason>;
  bookingReason: BookingReason;
  deletedBookingReasons: BookingReason[];
  reasonNames: {value: string, label: string}[]
}
const initialState: InitialState = {
  bookingReasons: {} as PaginationResponse<BookingReason>,
  bookingReason: {} as BookingReason,
  deletedBookingReasons: [],
  reasonNames: {} as {value: string, label: string}[],
};

export const bookingReasonSlice = createSlice({
  name: 'booking-reason',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBookingReasons.fulfilled, (state, { payload }) => {
      state.bookingReasons = payload;
    });
    builder.addCase(fetchBookingReasonById.fulfilled, (state, { payload }) => {
      state.bookingReason = payload;
    });
    builder.addCase(fetchDeletedBookingReasons.fulfilled, (state, { payload }) => {
      state.deletedBookingReasons = payload;
    });
    builder.addCase(fetchReasonNames.fulfilled, (state, { payload }) => {
      state.reasonNames = payload;
    });
  },
});

export const bookingReasonReducer = bookingReasonSlice.reducer;
