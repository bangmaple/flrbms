import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../../../constants/constant';
import { BookingRoomsByFilters } from '../../../models/booking-rooms-by-filters.model';
import { axiosGetAPICall } from '../../../api-call';
import { BookingRoomsByFiltersResponse } from '../../../models/booking-rooms-by-filters-response.model';

interface RejectValue {
  message: string;
}

export const fetchBookingRoomsByFilters = createAsyncThunk<
  BookingRoomsByFiltersResponse[],
  BookingRoomsByFilters,
  {
    rejectValue: RejectValue;
  }
>('room-booking/fetch-booking-rooms-by-filters', async (payload, thunkAPI) => {
  return await axiosGetAPICall(
    `${API_URL}/booking-room/filter`,
    {
      ...payload,
      status: JSON.stringify(payload.status),
    },
    thunkAPI
  );
});
