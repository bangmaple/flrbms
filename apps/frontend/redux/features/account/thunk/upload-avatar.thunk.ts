import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';

interface RejectValue {
  message: string;
}

export interface UploadAvatarRequestModel {
  img: File,
}

export interface UploadAvatarResponseModel {
  url: string;
  img: File;
  id: string;
}


export const uploadAvatar = createAsyncThunk<
  UploadAvatarResponseModel,
  UploadAvatarRequestModel,
  {
    rejectValue: RejectValue;
  }
>('account/upload-avatar', async (payload, thunkApi) => {
  thunkApi.dispatch(toggleSpinnerOn());
  try {
    if (payload.img) {
      const formData = new FormData();
      console.log(payload.img);
      formData.append('file', payload.img);
      const response = await axios.put(
        'api/accounts/update/upload-avatar/profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return await response.data;
    } else {
      return thunkApi.rejectWithValue;
    }
  } catch ({ response }) {
    if (response.status === 401 || response.status === 403) {
      return thunkApi.rejectWithValue({
        message: 'Access token is invalid',
      });
    } else if (response.status === 400) {
      return thunkApi.rejectWithValue({
        message: 'Bad request',
      });
    }
  } finally {
    thunkApi.dispatch(toggleSpinnerOff());
  }
});
