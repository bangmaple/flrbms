import {createAsyncThunk} from '@reduxjs/toolkit';
import {toggleSpinnerOff, toggleSpinnerOn} from '../../spinner';
import axios from 'axios';
import {PaginationResponse} from '../../../../models/pagination-response.payload';
import {PaginationParams} from '../../../../models/pagination-params.model';
import {Holiday} from "../../../../models/holiday.model";


export const fetchHolidays = createAsyncThunk<PaginationResponse<Holiday>,
  PaginationParams,
  {
    rejectValue: {
      message: string;
    };
  }>('holiday/fetch-holidays', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/holidays', {
      params: {
        page: payload.page,
        limit: payload.limit,
        search: payload.search,
        sort: payload.sort,
        dir: payload.dir,
      },
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
