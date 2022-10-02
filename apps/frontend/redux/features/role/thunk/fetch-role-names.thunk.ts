import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

export const fetchRoleNames = createAsyncThunk<
any[],
void,
{
  rejectValue: {
    message: string;
  };
}
>('role/fetch-role-names', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/roles/name');
    const result = await response.data.map(role => ({
      value: role.id,
      label: role.name
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



