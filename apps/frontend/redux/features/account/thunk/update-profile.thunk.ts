import { createAsyncThunk } from "@reduxjs/toolkit";
import { toggleSpinnerOff, toggleSpinnerOn } from "../../spinner";
import axios from "axios";

interface RejectValue {
  message: string;
}

export interface UpdateAccountRequestModel {
  id: string,
  fullname: string,
  phone: string,
  email: string
  description: string,
}

export interface UpdateAccountResponseModel {
  fullname: string,
  phone: string,
  description: string,
  id: string,
  username: string,
  email: string,
}


export const updateProfile = createAsyncThunk<UpdateAccountResponseModel,
  UpdateAccountRequestModel,
  {
    rejectValue: RejectValue;
  }>("account/update-profile", async (payload, thunkApi) => {
  thunkApi.dispatch(toggleSpinnerOn());
  try {
    const response = await axios
      .put(`/api/accounts/update-profile`, {
        fullname: payload.fullname,
        phone: payload.phone,
        email: payload.email,
        description: payload.description
      });
    return await response.data;
  } catch ({ response }) {
    if (response.status === 401 || response.status === 403) {
      return thunkApi.rejectWithValue({
        message: "Access token is invalid"
      });
    }
  } finally {
    thunkApi.dispatch(toggleSpinnerOff());
  }
});
