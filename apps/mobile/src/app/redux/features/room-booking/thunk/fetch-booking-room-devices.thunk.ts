import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { Device } from '../../../models/device.model';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';

interface RejectValue {
  message: string;
}

interface Payload {
  name: string;
  sort: string;
}

export const fetchBookingRoomDevices = createAsyncThunk<Device[], Payload, {
  rejectValue: RejectValue
}>("room-booking/fetch-devices", async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(`${API_URL}/booking-room/devices?name=${payload.name}&type=&sort=${payload.sort}`, {
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
