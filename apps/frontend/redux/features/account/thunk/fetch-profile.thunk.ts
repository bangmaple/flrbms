import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';

export const fetchProfile = createAsyncThunk(
  `/accounts/my-profile`,
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(toggleSpinnerOn());
    try {
      const response = await axios.get(`/api/accounts/my-profile`, {});
      const data = await response.data;
      window.localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch ({ response }) {
      if (response.status === 401 || response.status === 403) {
        return thunkAPI.rejectWithValue({
          message: 'Access token is invalid',
        });
      }
    } finally {
      thunkAPI.dispatch(toggleSpinnerOff());
    }
  }
);
