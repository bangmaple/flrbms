import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";

export const disableDeviceById = createAsyncThunk('device/disable-by-id', async (id: string, thunkAPI) => {
  const {dispatch} = thunkAPI;

  dispatch(toggleSpinnerOn());
  return axios.put(`/api/devices/disable/${id}`)
    .then((resp) => {
      return;
    }).finally(() =>  dispatch(toggleSpinnerOff()));
});
