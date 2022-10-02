import {createAsyncThunk} from '@reduxjs/toolkit';
import {toggleSpinnerOff, toggleSpinnerOn} from '../../spinner';
import axios from 'axios';
import {Slot} from '../../../../models/slot.model';
import {PaginationParams} from '../../../../models/pagination-params.model';
import {PaginationResponse} from '../../../../models/pagination-response.payload';

export const fetchAllSlots = createAsyncThunk<Slot,
  void,
  {
    rejectValue: {
      message: string;
    };
  }>('slot/fetch-all-slots', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('/api/slots', {
      params: payload,
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
