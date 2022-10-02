import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';

export const getRoomById = createAsyncThunk(
  'room/get-room-by-id',
  async (id: string, thunkAPI) => {
    thunkAPI.dispatch(toggleSpinnerOn());
    try {
      const response = await axios.get(`/api/rooms/find/${id}`);
      return await response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: e.response.data.message,
      });
    } finally {
      thunkAPI.dispatch(toggleSpinnerOff());
    }
  }
);
