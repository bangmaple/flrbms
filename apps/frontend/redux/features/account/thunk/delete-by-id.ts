import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';

export const deleteAccountById = createAsyncThunk(
  'account/delete-by-id',
  async (id: string, thunkAPI) => {
    try {
      thunkAPI.dispatch(toggleSpinnerOn());
      const response = await axios.delete(`/api/accounts/${id}`);
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
