import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";

interface UpdateTypeOfDevicePayload {
  id: string;
  body: {type: string};
}

interface UpdateDeviceRejectValue {
  message: string;
}

export const updateTypeThenRestore = createAsyncThunk<any, UpdateTypeOfDevicePayload, {
  rejectValue: UpdateDeviceRejectValue
}>('device/update-type-then-restore', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.put(`/api/devices/update-type-then-restore/${payload.id}`, payload.body);
    return await response.data;

  } catch (e: AxiosError | any) {
    if (e.response.status === 401 || e.response.status === 403) {
      return thunkAPI.rejectWithValue({
        message: "Access token is invalid"
      });
    } else {
      return thunkAPI.rejectWithValue({
        message: e.response.data.message
      });
    }
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }



});
