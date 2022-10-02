import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { defaultPaginationParams } from '../../../../models/pagination-params.model';
import { fetchRoles } from './fetch-roles.thunk';

export const addRole = createAsyncThunk<
  void,
  {
    name?: string;
    description?: string;
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('role/add', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.post(`api/roles`, {
      name: payload.name,
      description: payload.description,
    });
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
    thunkAPI.dispatch(fetchRoles(defaultPaginationParams));
  }
});
