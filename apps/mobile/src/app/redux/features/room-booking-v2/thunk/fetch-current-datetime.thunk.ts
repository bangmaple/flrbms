import {createAsyncThunk} from "@reduxjs/toolkit";
import {axiosGetAPICall} from "../../../api-call";
import {API_URL} from "../../../../constants/constant";

export const fetchCurrentDatetime = createAsyncThunk<{date: string, void, any}>('room-booking/fetch-current-datetime',
  async (payload, thunkAPI) => {
  return await axiosGetAPICall(`${API_URL}/config/current-date`, undefined, thunkAPI);
})
