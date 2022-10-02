import {createAsyncThunk} from '@reduxjs/toolkit';
import {toggleSpinnerOff, toggleSpinnerOn} from '../../spinner';
import axios from 'axios';
import {PaginationResponse} from '../../../../models/pagination-response.payload';
import {BookingRoomFeedback} from '../../../../models/bookng-room-feedback.model';
import {PaginationParams} from '../../../../models/pagination-params.model';

export const fetchBookingRoomFeedbacks = createAsyncThunk<PaginationResponse<BookingRoomFeedback>,
  PaginationParams,
  {
    rejectValue: {
      message: string;
    };
  }>('booking-room-feedbacks/fetch-booking-room-feedbacks', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {

    const response = await axios.get('api/booking-room-feedbacks', {
      params: {
        page: payload.page,
        limit: payload.limit,
        search: payload.search,
        sort: payload.sort,
        dir: payload.dir,
      },
    });
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
