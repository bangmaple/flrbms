import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";

export const deleteHolidayById = createAsyncThunk('holiday/delete-holiday-by-id', async (id: string, thunkAPI) => {
  const {dispatch} = thunkAPI;

  dispatch(toggleSpinnerOn());
  return axios.delete(`/api/holidays/${id}`)
    .then((resp) => resp.data).finally(() => dispatch(toggleSpinnerOff()));
});
