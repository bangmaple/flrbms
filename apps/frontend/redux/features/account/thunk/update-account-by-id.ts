import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Account } from "../../../../models/account.model";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";

interface UpdateAccountPayload {
  id: string;
  payload: Account;
}

interface UpdateAccountRejectValue {
  message: string;
}

export const updateAccountById = createAsyncThunk<any, UpdateAccountPayload, {
  rejectValue: UpdateAccountRejectValue
}>('account/update-by-id', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.put(`/api/accounts/update/${payload.id}`, payload.payload);
    return await response.data;

  } catch (e: AxiosError | any) {
    if (e.response.status === 401 || e.response.status === 403) {
      return thunkAPI.rejectWithValue({
        message: "Access token is invalid"
      });
    } else {
      return thunkAPI.rejectWithValue({
        message: e.response.data.message
      });
    }
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }



});
