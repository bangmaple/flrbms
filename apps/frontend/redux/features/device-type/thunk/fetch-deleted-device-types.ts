import {createAsyncThunk} from "@reduxjs/toolkit";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import axios from "axios";
import { DeviceType } from "../../../../models/device-type.model";

interface RejectValue {
  message: string;
}

export const fetchDeletedDeviceTypes = createAsyncThunk<DeviceType[], string, {
  rejectValue: RejectValue
}>('device-type/fetch-deleted', async (payload = "", thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.get(`/api/device-type/deleted?search=${payload}`);
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
