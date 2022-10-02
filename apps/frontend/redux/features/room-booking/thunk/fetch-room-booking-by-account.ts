import {createAsyncThunk} from "@reduxjs/toolkit";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import axios from "axios";
import {RoomBooking} from "../../../../models/room-booking.model";

interface RejectValue {
  message: string;
}

export const fetchRequestByAccountId = createAsyncThunk<RoomBooking[], string, {
  rejectValue: RejectValue
}>('room-booking/by-account', async (accountId, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.get(`/api/booking-room/by-account-id?account-id=${accountId}`);
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
