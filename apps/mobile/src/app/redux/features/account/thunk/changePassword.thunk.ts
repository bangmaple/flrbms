import { createAsyncThunk } from '@reduxjs/toolkit';
import { ChangePasswordRequestModel } from '../../../models/change-password-request.model';
import { ChangePasswordResponseModel } from '../../../models/change-password-response.model';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';

interface RejectValue {
  message: string;
}

export const doChangePassword = createAsyncThunk<
  ChangePasswordResponseModel,
  ChangePasswordRequestModel,
  {
    rejectValue: RejectValue;
  }
>('account/change-password', async (payload, thunkApi) => {
  thunkApi.dispatch(toggleSpinnerOn());
  const accessToken = LOCAL_STORAGE.getString('accessToken');
  try {
    const response = await axios.put(
      `${API_URL}/accounts/update/change-password`,
      {
        username: payload.username,
        password: payload.password,
        newPassword: payload.newPassword,
      },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return await response.data;
  } catch (e) {
    return thunkApi.rejectWithValue(e.message);
  } finally {
    thunkApi.dispatch(toggleSpinnerOff());
  }
});
