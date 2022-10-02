import {createAsyncThunk} from "@reduxjs/toolkit";
import axios, {AxiosError} from "axios";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import {Holiday} from "../../../../models/holiday.model";
import dayjs from "dayjs";

interface UpdateHolidayPayload {
  id: string;
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
}

interface UpdateHolidayRejectValue {
  message: string;
}

export const updateHolidayById = createAsyncThunk<any, UpdateHolidayPayload, {
  rejectValue: UpdateHolidayRejectValue
}>('holiday/update-holiday-by-id', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.put(`/api/holidays/update/${payload.id}`,
      {
        name: payload.name,
        description: payload.description,
        dateStart: dayjs(payload.dateStart).format('YYYY-MM-DD'),
        dateEnd: dayjs(payload.dateEnd).format('YYYY-MM-DD')
      });
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
