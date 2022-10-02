import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';

interface RejectPayload {
  message: string;
}

export const validateAccessToken =  createAsyncThunk('auth/validate-access-token', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(`${API_URL}/health/auth`, {
      headers: {
        Authorization: `Bearer ${LOCAL_STORAGE.getString('accessToken')}`
      }
    });
    return await response.data;

  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());

  }
});
