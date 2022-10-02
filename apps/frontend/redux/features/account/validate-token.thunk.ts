import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {toggleSpinnerOff, toggleSpinnerOn} from "../spinner";
import {RootState} from "../../store";
import {invalidateAuthUser} from "./auth.slice";

interface ValidateAccessTokenModel {
  accessToken: string;
}

interface RejectValueModel {
  message: string;
}

export const doValidateAccessToken = createAsyncThunk<void, void, {
  rejectValue: RejectValueModel,
}>
('auth/validate-access-token', async (payload: void, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  const response = await axios.get('/api/health/auth');
  const statusCode = response.status;
  thunkAPI.dispatch(toggleSpinnerOff());

  if (statusCode === 403 || statusCode === 401) {
    thunkAPI.dispatch(invalidateAuthUser());
    return thunkAPI.rejectWithValue({
      message: 'Invalid access token',
    });
  }

  return await response.data;
});
