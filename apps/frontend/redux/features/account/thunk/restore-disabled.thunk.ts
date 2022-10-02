import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";



export const restoreDisabledAccount = createAsyncThunk<any, any, {
  rejectValue: {
    message: string
  }
}>('account/restore-disabled-room', async (id: string, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.put(`/api/accounts/restore-disabled/${id}`);
    return await response.data;
  } catch ({response}) {
    return thunkAPI.rejectWithValue({
      message: 'Access token is invalid',
    })
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
