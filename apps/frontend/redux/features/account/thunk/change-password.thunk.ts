import { createAsyncThunk } from "@reduxjs/toolkit";
import { toggleSpinnerOff, toggleSpinnerOn } from "../../spinner";
import axios from "axios";

interface RejectValue {
  message: string;
}

interface ChangePasswordRequestModel {
  username: string;
  password: string;
  newPassword: string;
}

export interface ChangePasswordResponseModel {
  message: string;
}

export const changePassword = createAsyncThunk<ChangePasswordResponseModel,
  ChangePasswordRequestModel,
  {
    rejectValue: RejectValue;
  }>("account/change-password", async (payload, thunkApi) => {
  thunkApi.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.put(`/api/accounts/update/change-password`, {
      username: payload.username,
      password: payload.password,
      newPassword: payload.newPassword,
    });

    console.log(payload.username, payload.password, payload.newPassword);
    return await response.data;
  } catch ({ response }) {
    if (response.status === 401 || response.status === 403) {
      return thunkApi.rejectWithValue({
        message: "Access token is invalid"
      });
    }
    if (response.status === 400){
      return thunkApi.rejectWithValue({
        message: "Old password is incorrect"
      });
    }
    if (response.status === 500){
      return thunkApi.rejectWithValue({
        message: "Can't connect to server, try again later"
      });
    }
  } finally {
    thunkApi.dispatch(toggleSpinnerOff());
  }
});
