import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';

export const fetchCountRequestInWeekOfUser = createAsyncThunk<
  {
    isAvailable: boolean;
  },
  void,
  {
    rejectValue: {
      message: string;
    };
  }
>(
  'room-booking/fetch-count-request-in-week-of-user',
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(toggleSpinnerOn());
    const user = JSON.parse(LOCAL_STORAGE.getString('user'));
    try {
      const response = await axios.get(
        `${API_URL}/booking-room/count-request/${user.id}`,
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
