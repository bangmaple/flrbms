import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

interface AddPayload {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  description: string;
  roleId: string;
}

interface RejectValue {
  message: string;
}

export const addAccount = createAsyncThunk<
  void,
  AddPayload,
  {
    rejectValue: RejectValue;
  }
>('accounts/add-account', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.post(`/api/accounts`, payload);
    return await response.data;
  } catch ({ response }) {
    if (response.status === 401 || response.status === 403) {
      return thunkAPI.rejectWithValue({
        message: 'Access token is invalid',
      });
    } else {
      return thunkAPI.rejectWithValue({
        message: response.data.message,
      });
    }
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
