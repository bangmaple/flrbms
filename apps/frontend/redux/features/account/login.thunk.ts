import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { API_URL } from '../../../utils/api';
import { UserLoginSuccessModel } from '../../../models/user/user-login-success-response.model';
import { toggleSpinnerOff, toggleSpinnerOn } from '../spinner';

export const doLogin = createAsyncThunk<
  UserLoginSuccessModel,
  UserCredentials,
  {
    rejectValue: LoginErrorThunk;
  }
>('user/login', async (credentials, thunkApi) => {
  const dispatch = thunkApi.dispatch;
  dispatch(toggleSpinnerOn());
  try {
    const response = await axios.post("/api/v1/login", {
      username: credentials.username,
      password: credentials.password
    });

    const data = await response.data;
    window.localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (e) {
    return thunkApi.rejectWithValue({
      message: e.response.data?.message ?? 'Internal Server Error',
    });
  } finally {
    dispatch(toggleSpinnerOff());
  }
});

interface LoginErrorThunk {
  message: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserLoginFailedModel {
  statusCode: number;
  message: string;
}
