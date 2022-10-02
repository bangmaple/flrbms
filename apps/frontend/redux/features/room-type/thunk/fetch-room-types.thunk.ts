import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { PaginationResponse } from '../../../../models/pagination-response.payload';
import { RoomType } from '../../../../models/room-type.model';
import { PaginationParams } from '../../../../models/pagination-params.model';

export const fetchRoomTypes = createAsyncThunk<
  PaginationResponse<RoomType>,
  PaginationParams,
  {
    rejectValue: {
      message: string;
    };
  }
>('room-type/fetch-room-types', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/room-type', {
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
