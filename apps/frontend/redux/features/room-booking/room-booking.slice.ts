import {createSlice} from '@reduxjs/toolkit';
import {RoomBooking} from '../../../models/room-booking.model';
import {fetchRoomBookings} from './thunk/fetch-room-booking-list';
import {fetchRoomBookingById} from './thunk/fetch-room-booking-by-id';
import {PaginationResponse} from '../../../models/pagination-response.payload';
import {Statistics} from '../../../models/statistics.model';
import {fetchStatistic} from './thunk/fetch-statistics.thunk';
import {BookingRoomStatistics} from "../../../models/booking-room-statistics.model";

// import { updateRoomBookingById } from "./thunk/update-room-booking-by-id";
// import { addRoomBooking } from "./thunk/add-room-booking";

interface BookingRoom {
  roomBookings: PaginationResponse<RoomBooking>;
  roomBooking: RoomBooking;
  statistics: Statistics;
  bookingRoomStatistics: BookingRoomStatistics
}

const initialState: BookingRoom = {
  roomBookings: {} as PaginationResponse<RoomBooking>,
  roomBooking: {} as RoomBooking,
  statistics: {} as Statistics,
  bookingRoomStatistics: {} as BookingRoomStatistics
};

export const roomBookingSlice = createSlice({
  name: 'roomBooking',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRoomBookings.fulfilled, (state, {payload}) => {
      state.roomBookings = payload;
    });

    builder.addCase(fetchRoomBookings.rejected, (state, {payload}) => {
      console.log('Fetch rejected', state);
    });

    builder.addCase(fetchRoomBookingById.fulfilled, (state, {payload}) => {
      state.roomBooking = payload;
    });
    builder.addCase(fetchStatistic.fulfilled, (state, {payload}) => {
      state.bookingRoomStatistics = payload;
    })

    //   builder.addCase(updateRoomBookingById.fulfilled, (state, {payload}) => {
    //     console.log("updateRoomBookingById.fulfilled")
    //   });

    //   builder.addCase(addRoomBooking.fulfilled, (state, {payload}) => {
    //     console.log("addRoomBooking.fulfilled")
    //   });

    //   builder.addCase(addRoomBooking.rejected, (state, {payload}) => {
    //     console.log("addRoomBooking.rejected")
    //   });
  },
});

export const roomBookingReducer = roomBookingSlice.reducer;
