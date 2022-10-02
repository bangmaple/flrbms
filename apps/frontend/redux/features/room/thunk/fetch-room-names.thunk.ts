import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

export const fetchRoomNames = createAsyncThunk<
any[],
void,
{
  rejectValue: {
    message: string;
  };
}
>('rooms/fetch-room-names', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/rooms/name');
    const result = await response.data.map(room => ({
      value: room.id,
      label: room.name
    }))
    return await result;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});



