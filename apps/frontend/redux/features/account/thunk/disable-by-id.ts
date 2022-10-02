import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';

export const disableAccountById = createAsyncThunk(
  'account/disable-by-id',
  async (id: string, thunkAPI) => {
    thunkAPI.dispatch(toggleSpinnerOn());
    try {
      const response = await axios.put(`/api/accounts/disable/${id}`);
      return await response.data;
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
