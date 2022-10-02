import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios, { AxiosError } from 'axios';
import { API_URL } from '../../../../constants/constant';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';

interface RequestPayload {
  id: string;
}

interface Device {
  id: string;
  deviceName: string;
  bookingRequestId: string;
  deviceId: string;
  deviceQuantity: number;
}

interface RejectValue {
  message: string;
}

export const fetchDeviceInUseByBookingRequestId = createAsyncThunk<
  Device[],
  RequestPayload,
  {
    rejectValue: RejectValue;
  }
>(
  'room-booking/fetch-devices-by-booking-room-id',
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(toggleSpinnerOn());
    try {
      const response = await axios.get(
        `${API_URL}/booking-room/devices-use-in-request/${payload}`,
        {
          headers: {
            "Authorization": `Bearer ${LOCAL_STORAGE.getString("accessToken")}`
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
