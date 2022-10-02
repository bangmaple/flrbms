import {createAsyncThunk} from "@reduxjs/toolkit";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import axios from "axios";
import {Account} from "../../../../models/account.model";

interface RejectValue {
  message: string;
}

export const fetchDeletedAccounts = createAsyncThunk<Account[], string, {
  rejectValue: RejectValue
}>('account/fetch-deleted', async (payload = "", thunkAPI)=> {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.get(`/api/accounts/deleted?search=${payload}`);
    return await response.data;
  } catch ({response}) {
    if (response.status === 401 || response.status === 403) {
      return thunkAPI.rejectWithValue({
        message: 'Access token is invalid'
      })
    }
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
