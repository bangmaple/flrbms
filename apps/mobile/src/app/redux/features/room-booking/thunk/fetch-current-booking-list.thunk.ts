import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';
import { CurrentBookingRoom } from '../../../models/current-booking-room.model';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';

export const fetchCurrentBookingRoomList = createAsyncThunk<
  CurrentBookingRoom[],
  void,
  {
    rejectValue: {
      message: string;
    };
  }
>('room-booking/fetch-current-booking-list', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.get(
      `${API_URL}/booking-room/current-booking-list`,
      {
        headers: {
          Authorization: LOCAL_STORAGE.getString('accessToken'),
        },
      }
    );
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
