import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios, { AxiosError } from 'axios';
import { API_URL } from '../../../../constants/constant';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';

interface RequestPayload {
  dateStart: string;
  dateEnd: string;
  checkinSlot: number;
  checkoutSlot: number;
}

interface Room {
  id: string;
  name: string;
  description: string;
  type: string;
}

interface RejectValue {
  message: string;
}

export const fetchRoomFreeByMultiSlotAndDay = createAsyncThunk<
  Room[],
  RequestPayload,
  {
    rejectValue: RejectValue;
  }
>(
  'room-booking/fetch-room-free-by-multi-slot-and-day',
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(toggleSpinnerOn());
    try {
      const response = await axios.get(
        `${API_URL}/booking-room/list-room-free-at-multi-date?`,
        {
          params: {
            dateStart: payload.dateStart,
            dateEnd: payload.dateEnd,
            checkinSlot: payload.checkinSlot,
            checkoutSlot: payload.checkoutSlot
          },
          headers: {
            Authorization: `Bearer ${LOCAL_STORAGE.getString('accessToken')}`,
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
  }
);
