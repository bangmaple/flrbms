import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";



export const restoreDisabledRoom = createAsyncThunk<any, any, {
  rejectValue: {
    message: string
  }
}>('room/restore-disabled-room', async (id: string, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.put(`/api/rooms/restore-disabled/${id}`);
    return await response.data;
  } catch ({response}) {
    return thunkAPI.rejectWithValue({
      message: 'Access token is invalid',
    })
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
