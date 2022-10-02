import {createAsyncThunk} from "@reduxjs/toolkit";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import axios from "axios";
import { Slot } from "../../../../models/slot.model";

interface RejectValue {
  message: string;
}

export const fetchDeletedSlots = createAsyncThunk<Slot[], string, {
  rejectValue: RejectValue
}>('slot/fetch-deleted', async (payload = "", thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.get(`/api/slots/deleted?search=${payload}`);
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
