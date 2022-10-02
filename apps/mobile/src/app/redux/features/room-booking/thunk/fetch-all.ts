import { createAsyncThunk } from '@reduxjs/toolkit';
import { BookingRoom } from '../../../models/booking-room.model';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';

interface RejectValue {
  message: string;
}

interface BookingRoomPayload {
  slot: number;
  search: string;
  sorting: string;
}

export const fetchAllBookingRooms = createAsyncThunk<
  BookingRoom[],
  BookingRoomPayload,
  {
    rejectValue: RejectValue;
  }
>('room-booking/fetch-all', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(`${API_URL}/booking-room`, {
      headers: {
        Authorization: `Bearer ${LOCAL_STORAGE.getString('accessToken')}`,
      },
      params: {
        slot: payload,
        search: payload.search,
        sorting: payload.sorting,
      },
    });
    return await response.data;
  } catch (e) {
    thunkAPI.rejectWithValue({
      message: e.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
