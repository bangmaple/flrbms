import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';

interface RejectValue {
  message: string;
}

interface GetRoomNameBookedSameSlotPayload {
  checkinDate: string;
  userId: string;
  checkinSlot: string;
  checkoutSlot: string;
}

export const getRoomNameBookedSameSlot = createAsyncThunk<
  string,
  GetRoomNameBookedSameSlotPayload,
  {
    rejectValue: RejectValue;
  }
  >('room-booking/get-room-name-booked-same-slot', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(
      `${API_URL}/booking-room/get-room-name-booked-same-slot`,
      {
        params: {
          checkinDate: payload.checkinDate,
          userId: payload.userId,
          checkinSlot: payload.checkinSlot,
          checkoutSlot: payload.checkoutSlot
        },
      }
    );
    return await response.data;
  } catch (e) {
    thunkAPI.rejectWithValue({
      message: e.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
