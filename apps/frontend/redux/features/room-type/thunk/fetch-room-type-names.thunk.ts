import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

export const fetchRoomTypeNames = createAsyncThunk<
any[],
void,
{
  rejectValue: {
    message: string;
  };
}
>('room-type/fetch-room-type-names', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/room-type/name');
    const result = await response.data.map(roomtype => ({
      value: roomtype.id,
      label: roomtype.name
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



