import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';


interface FetchRoomsRejectPayload {
  message: string;
}

export const fetchUsername = createAsyncThunk<
  { value: string; lable: string }[],
  void,
  {
    rejectValue: FetchRoomsRejectPayload;
  }
>('room/fetch-username', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(`api/booking-room/accounts-name`, {});
    const dataReturn = response.data.map((value) => ({
      value: value,
      label: value,
    }));
    return await dataReturn;
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
