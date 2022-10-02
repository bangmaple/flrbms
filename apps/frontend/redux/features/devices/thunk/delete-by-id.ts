import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {toggleSpinnerOff} from "../../spinner";

export const deleteDeviceById = createAsyncThunk('device/delete-by-id', async (id: string, thunkAPI) => {
    try {
      const response = await axios.delete(`/api/devices/${id}`);
      return await response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: e.response.data.message,
      });
    } finally {
      thunkAPI.dispatch(toggleSpinnerOff());
    }
});
