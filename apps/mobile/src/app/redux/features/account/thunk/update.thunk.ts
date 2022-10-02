import { createAsyncThunk } from '@reduxjs/toolkit';
import { UpdateAccountResponseModel } from '../../../models/update-account-response.model';
import { UpdateAccountRequestModel } from '../../../models/update-account-request.model';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';

interface RejectValue {
  message: string;
}

export const doUpdateProfile = createAsyncThunk<
  UpdateAccountResponseModel,
  UpdateAccountRequestModel,
  {
    rejectValue: RejectValue;
  }
>('account/update-profile', async (payload, thunkApi) => {
  thunkApi.dispatch(toggleSpinnerOn());
  const accessToken = LOCAL_STORAGE.getString('accessToken');
  try {
    const response = await axios.put(
      `${API_URL}/accounts/update-profile`,
      {
        fullname: payload.fullname,
        phone: payload.phone,
        email: payload.email,
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
