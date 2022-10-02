import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { fetchRoomTypes } from './fetch-room-types.thunk';
import { defaultPaginationParams } from '../../../../models/pagination-params.model';

export const addRoomType = createAsyncThunk<
  void,
  {
    name?: string;
    description?: string;
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('room-type/add', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.post(`api/room-type`, {
      name: payload.name,
      description: payload.description,
    });
    return await response.data;
  } catch (e) {
    if(e.response.data.message.includes("duplicate")){
      return thunkAPI.rejectWithValue({
        message: "There already exists a room type with the this name. Try with another name.",
      });
    } else if (e.response.status === 401 || e.response.status === 403) {
      return thunkAPI.rejectWithValue({
        message: "Access token is invalid"
      });
    }
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
    thunkAPI.dispatch(fetchRoomTypes(defaultPaginationParams));
  }
});
