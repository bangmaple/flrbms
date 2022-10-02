import {createAsyncThunk} from "@reduxjs/toolkit";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import axios from "axios";

interface AddRoomPayload {
  name: string;
  description: string;
  isDisabled: boolean;
  type: string;
  capacity: number;
}

interface AddRoomRejectValue {
  message: string;
}

export const addRoom = createAsyncThunk<void, AddRoomPayload, {
  rejectValue: AddRoomRejectValue
}>('room/add-room', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.post(`/api/rooms/add`, {
      name: payload.name,
      description: payload.description,
      isDisabled: payload.isDisabled,
      type: payload.type,
      capacity: payload.capacity
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
