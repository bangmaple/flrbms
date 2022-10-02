import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { defaultPaginationParams } from '../../../../models/pagination-params.model';
import { fetchRoles } from './fetch-roles.thunk';

export const updateRoleById = createAsyncThunk<
  void,
  {
    id?: string;
    name?: string;
    description?: string;
  },
  {
    rejectValue: {
      message: string;
    };
  }
>('role/update-by-id', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    console.log("PAYLOAF ID", payload.id);
    const response = await axios.put(`api/roles/${payload.id}`, {
      id: payload.id,
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
