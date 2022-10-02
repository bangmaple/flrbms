import {createAsyncThunk} from "@reduxjs/toolkit";
import axios, {AxiosError} from "axios";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import {Holiday} from "../../../../models/holiday.model";
import dayjs from "dayjs";

interface UpdateSlotPayload {
  id: string;
  name: string;
  start: string;
  end: string;
}

interface UpdateSlotRejectValue {
  message: string;
}

export const updateSlot = createAsyncThunk<any, UpdateSlotPayload, {
  rejectValue: UpdateSlotRejectValue
}>('holiday/update-holiday-by-id', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.put(`/api/slots/update/${payload.id}`,
      {
        name: payload.name,
        start: dayjs(payload.start).format('HH:mm:ss'),
        end: dayjs(payload.end).format('HH:mm:ss'),
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
