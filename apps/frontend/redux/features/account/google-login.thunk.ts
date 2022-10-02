import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {toggleSpinnerOff, toggleSpinnerOn} from "../spinner";

interface GoogleLoginTokenPayload {
  token: string;
}

export const doLoginWithGoogle = createAsyncThunk<any, GoogleLoginTokenPayload, {
  rejectValue: {
    message: string;
  }
}>('user/login-google',async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.post('/api/auth/signin/google', {
      token: payload.token,
    });
    const data =  await response.data;
    window.localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch ({response}) {
    return thunkAPI.rejectWithValue({
      message: response?.message,
    })
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }

});
