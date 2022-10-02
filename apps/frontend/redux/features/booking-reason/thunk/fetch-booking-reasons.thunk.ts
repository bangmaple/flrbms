import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { PaginationResponse } from '../../../../models/pagination-response.payload';
import { PaginationParams } from '../../../../models/pagination-params.model';
import { BookingReason } from '../../../../models/booking-reason.model';

export const fetchBookingReasons = createAsyncThunk<
  PaginationResponse<BookingReason>,
  PaginationParams,
  {
    rejectValue: {
      message: string;
    };
  }
>('booking-reason/fetch-booking-reasons', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/booking-reasons', {
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
