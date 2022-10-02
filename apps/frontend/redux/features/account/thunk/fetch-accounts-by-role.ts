import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { Room } from '../../../../models/room.model';

interface RejectValue {
  message: string;
}

export const fetchAccountByRole = createAsyncThunk<
  Room[],
  string,
  {
    rejectValue: RejectValue;
  }
>('accounts/by-role', async (roleId, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.get(`/api/accounts/by-role?role=${roleId}`);
    return await response.data;
  } catch ({ response }) {
    if (response.status === 401 || response.status === 403) {
      return thunkAPI.rejectWithValue({
        message: 'Access token is invalid',
      });
    }
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
