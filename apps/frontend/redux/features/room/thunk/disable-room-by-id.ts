import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";

export const disableRoomById = createAsyncThunk('room/disable-room-by-id', async (id: string, thunkAPI) => {
  const {dispatch} = thunkAPI;

  dispatch(toggleSpinnerOn());
  return axios.put(`/api/rooms/disable/${id}`)
    .then((resp) => {
      return;
    }).finally(() =>  dispatch(toggleSpinnerOff()));
});
