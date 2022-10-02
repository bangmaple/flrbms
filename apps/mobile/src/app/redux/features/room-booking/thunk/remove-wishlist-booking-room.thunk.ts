import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';

interface Payload {
  roomId: string;
  slot: number;
}

interface RejectValue {
  message: string;
}

export const removeWishlistBookingRoom = createAsyncThunk<void, Payload, {
  rejectValue: RejectValue
}>("room-booking/remove-from-wishlist", async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.delete(`${API_URL}/booking-room/remove-from-wishlist?roomId=${payload.roomId}&slot=${payload.slot}`, {
      headers: {
        Authorization: LOCAL_STORAGE.getString("accessToken")
      }
    });
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.message
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
