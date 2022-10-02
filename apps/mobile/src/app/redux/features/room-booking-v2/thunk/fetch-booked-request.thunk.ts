import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { API_URL } from '../../../../constants/constant';
import { BookedRequest } from '../../../models/booked-request.model';

interface RequestPayload {
  date: string;
  checkinSlotId: string;
  checkoutSlotId: string;
}

interface RejectValue {
  message: string;
}

export const fetchBookedRequestByDayAndSlot = createAsyncThunk<
  BookedRequest[],
  RequestPayload,
  {
    rejectValue: RejectValue;
  }
  >('room-booking/fetch-free-room', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(
      `${API_URL}/booking-room/get-booked-requests`,
      {
        params: {
          date: payload.date,
          checkinSlotId: payload.checkinSlotId,
          checkoutSlotId: payload.checkoutSlotId,
        },
      }
    );
    return await response.data;
  } catch (e: AxiosError | any) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
