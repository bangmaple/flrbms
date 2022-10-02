import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";

export const deleteRoomById = createAsyncThunk('room/delete-room-by-id', async (id: string, thunkAPI) => {
  const {dispatch} = thunkAPI;

  dispatch(toggleSpinnerOn());
  return axios.delete(`/api/rooms/${id}`)
    .then((resp) =>  resp.data).finally(() =>  dispatch(toggleSpinnerOff()));
});
