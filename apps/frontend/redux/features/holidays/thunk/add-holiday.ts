import {createAsyncThunk} from "@reduxjs/toolkit";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import axios from "axios";
import dayjs from "dayjs";

interface AddHolidayPayload {
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
}

interface AddHolidayRejectValue {
  message: string;
}

export const addHoliday = createAsyncThunk<void, AddHolidayPayload, {
  rejectValue: AddHolidayRejectValue
}>('holiday/add-holiday', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.post(`/api/holidays/add`, {
      name: payload.name,
      description: payload.description,
      dateStart: dayjs(payload.dateStart).format('YYYY-MM-DD'),
      dateEnd:  dayjs(payload.dateEnd).format('YYYY-MM-DD')
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
