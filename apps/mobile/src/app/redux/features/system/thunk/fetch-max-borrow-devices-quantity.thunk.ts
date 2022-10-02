import { createAsyncThunk } from '@reduxjs/toolkit';
import { BookedRequest } from '../../../models/booked-request.model';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios, { AxiosError } from 'axios';
import { API_URL } from '../../../../constants/constant';

export const fetchMaxBorrowDevicesQuantity = createAsyncThunk<
  number,
  void,
  any
>('system/fetch-max-borrow-devices-quantity', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(
      `${API_URL}/config/max-borrow-devices-quantity`
    );
    return await response.data;
  } catch (e: AxiosError | any) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
