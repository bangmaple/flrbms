import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';

export const fetchAccountById = createAsyncThunk(
  'account/fetch-by-id',
  async (id: string, thunkAPI) => {
    try {
      thunkAPI.dispatch(toggleSpinnerOn());
      const response = await axios.get(`/api/accounts/find/${id}`);
      const data = await response.data;
      return data;
    } catch (e: AxiosError | any) {
      if (e.response.status === 401 || e.response.status === 403) {
        return thunkAPI.rejectWithValue({
          message: 'Access token is invalid',
        });
      } else {
        return thunkAPI.rejectWithValue({
          message: e.response.data.message,
        });
      }
    } finally {
      thunkAPI.dispatch(toggleSpinnerOff());
    }
  }
);
