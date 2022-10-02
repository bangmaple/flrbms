import { createAsyncThunk } from '@reduxjs/toolkit';
import { CurrentBookingRoom } from '../../../models/current-booking-room.model';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';

export const fetchCurrentRoomBookingDetail = createAsyncThunk<
  CurrentBookingRoom,
  string,
  {
    rejectValue: {
      message: string;
    };
  }
>(
  'room-booking/fetch-current-room-booking-detail',
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(toggleSpinnerOn());

    try {
      const response = await axios.get(
        `${API_URL}/booking-room/current-booking/${payload}`,
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
  }
);
