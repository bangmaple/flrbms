import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { Account } from '../../../../models/account.model';
import { PagingParams } from '../../../../models/pagination-params/paging-params.model';
import { PaginationResponse } from '../../../../models/pagination-response.payload';


interface FetchAccountsRejectPayload {
  message: string;
}

export const fetchAccounts = createAsyncThunk<
  PaginationResponse<Account>,
  PagingParams,
  {
    rejectValue: FetchAccountsRejectPayload;
  }
>('accounts/fetch-accounts', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get(`api/accounts`, {
      params: {
        page: payload.page,
        search: payload.search,
        dir: payload.dir,
        limit: payload.limit,
        sort: payload.sort,
      },
    });
    return await response.data;
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
