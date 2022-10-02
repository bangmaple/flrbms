import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import dayjs from 'dayjs';

interface UpdateRequestPayload {
  requestId: string;
  listDevice: any[];
}

interface AddRequestRejectValue {
  message: string;
}

export const updateListDevice = createAsyncThunk<
  string,
  UpdateRequestPayload,
  {
    rejectValue: AddRequestRejectValue;
  }
>('booking-room/update-list-device', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const listDeviceFormated = payload.listDevice.map((device) => ({
      value: device.deviceId,
      quantity: device.deviceQuantity,
    }));
    const response = await axios.put(`/api/booking-room/update-list-device`, {
      requestId: payload.requestId,
      listDevice: listDeviceFormated,
    });
    return await response.data;
  } catch (e) {
    if (e.response.status === 401 || e.response.status === 403) {
      return thunkAPI.rejectWithValue({
        message: 'Access token is invalid',
      });
    } else {
      return thunkAPI.rejectWithValue({
        message: e.response.data.message,
      });
    }
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
