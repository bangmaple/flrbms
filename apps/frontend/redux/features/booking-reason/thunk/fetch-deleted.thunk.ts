import {createAsyncThunk} from "@reduxjs/toolkit";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import axios from "axios";
import {BookingReason} from "../../../../models/booking-reason.model";

interface RejectValue {
  message: string;
}

export const fetchDeletedBookingReasons = createAsyncThunk<BookingReason[], void, {
  rejectValue: RejectValue
}>('booking-reason/fetch-deleted', async (any, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.get(`/api/booking-reasons/deleted?search=`);
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
