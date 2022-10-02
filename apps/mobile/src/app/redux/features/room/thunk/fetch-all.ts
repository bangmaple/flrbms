import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { API_URL } from '../../../../constants/constant';
import { RoomModel } from '../../../models/room.model';

interface RejectValue {
  message: string;
}

export const fetchAllRooms = createAsyncThunk<
  RoomModel[],
  void,
  {
    rejectValue: RejectValue;
  }
  >('room/fetch-all', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(
      `${API_URL}/rooms?page=1&search=&dir=ASC&limit=50&sort=name`
    );
    return await response.data.items;
  } catch (e: AxiosError | any) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
