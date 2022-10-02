import {createAsyncThunk} from "@reduxjs/toolkit";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import axios from "axios";
import {Device} from "../../../../models/device.model";

interface RejectValue {
  message: string;
}

export const fetchDevicesByDeviceType = createAsyncThunk<Device[], string, {
  rejectValue: RejectValue
}>('device/by-device-type', async (deviceTypeId, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.get(`/api/devices/by-device-type?type=${deviceTypeId}`);
    return await response.data;
  } catch ({response}) {
    if (response.status === 401 || response.status === 403) {
      return thunkAPI.rejectWithValue({
        message: 'Access token is invalid'
      })
    }
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
