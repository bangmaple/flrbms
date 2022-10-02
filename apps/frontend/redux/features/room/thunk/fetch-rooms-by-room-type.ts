import {createAsyncThunk} from "@reduxjs/toolkit";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import axios from "axios";
import {Room} from "../../../../models/room.model";

interface RejectValue {
  message: string;
}

export const fetchRoomsByRoomType = createAsyncThunk<Room[], string, {
  rejectValue: RejectValue
}>('room/by-room-type', async (roomTypeId, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.get(`/api/rooms/by-room-type?type=${roomTypeId}`);
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
