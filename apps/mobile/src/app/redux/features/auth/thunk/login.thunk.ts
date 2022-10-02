import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthUser } from '../../../models/auth-user.model';
import { LoginCredentials } from '../../../models/login-request.model';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';

interface RejectValue {
  message: string;
}

export const doLogin = createAsyncThunk<
  AuthUser,
  LoginCredentials,
  {
    rejectValue: RejectValue;
  }
>('auth/login', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, {
      username: payload.username,
      password: payload.password,
    });
    const data = await response.data;
    LOCAL_STORAGE.set('accessToken', response.headers['authorization']);
    LOCAL_STORAGE.set(
      'refreshToken',
      response.headers['authorizationrefreshtoken']
    );
    LOCAL_STORAGE.set('user', JSON.stringify(data));

    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response.data.message);
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
