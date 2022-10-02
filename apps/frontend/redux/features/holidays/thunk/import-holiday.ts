import {createAsyncThunk} from "@reduxjs/toolkit";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import axios from "axios";

interface AddHolidayPayload {
  holiday_name: string;
  description: string;
  date_start: string;
  date_end: string;
}

interface AddHolidayRejectValue {
  message: string;
}

export const importHoliday = createAsyncThunk<void, any[], {
  rejectValue: AddHolidayRejectValue
}>('holiday/import-holiday', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.post(`/api/holidays/import`, {
      file: payload
    });
    return await response.data;
  } catch (e) {
    if (e.response.status === 401 || e.response.status === 403) {
      return thunkAPI.rejectWithValue({
        message: "Access token is invalid"
      });
    } else {
      console.log(e);
      return thunkAPI.rejectWithValue({
        message: e.response.data.message
      });
    }
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
