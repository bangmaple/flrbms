import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios, { AxiosError } from 'axios';
import { API_URL } from '../../../../constants/constant';
import { ChoosingBookingRoom } from '../../../models/choosing-booking-room.model';

interface RequestPayload {
  roomName: {
    name: string;
    sort: string;
  };
  roomType: {
    name: string;
    sort: string;
  };
}

interface RejectValue {
  message: string;
}

export const fetchChoosingBookingRoom = createAsyncThunk<ChoosingBookingRoom[], RequestPayload, {
  rejectValue: RejectValue
}>('room-booking/fetch-choosing-booking-rooms', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(`${API_URL}/booking-room/rooms`,{
      params: {
        filter: JSON.stringify(payload)
      }
    });

    return await response.data;
  } catch (e: AxiosError | any) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    })
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
