import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import dayjs from 'dayjs';

interface AddPayload {
  name: string;
  start: Date;
  end: Date;
}

interface RejectValue {
  message: string;
}

export const addSlot = createAsyncThunk<
  void,
  AddPayload,
  {
    rejectValue: RejectValue;
  }
>('slot/add-slot', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.post(`/api/slots`, {
      ...payload,
      start: dayjs(payload.start).format('HH:mm:ss'),
      end: dayjs(payload.end).format('HH:mm:ss'),
    });
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
