import { createSlice } from '@reduxjs/toolkit';
import {doUpdateProfile} from "./features/account/thunk/update.thunk";
import {doChangePassword} from "./features/account/thunk/changePassword.thunk";
import {doLogin} from "./features/auth/thunk/login.thunk";

export interface UserProfileModel {
  fullname: string;
  phone: string;
  studentCode: string;
}
export interface UserState {
    role: string;
    username: string;
    googleIdToken: string;
    user: UserProfileModel;
};

const initialState: UserState = {
  role: '',
  username: '',
  googleIdToken: '',
  user: {
    fullname: 'Ngô Nguyên Bằng',
    phone: '',
    studentCode: '',
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state) => {
      state.username = 'test'
    },
    logout: (state) => {
      state.username = ''
    },
    persistGoogleIdToken: (state, action) => {
      state.googleIdToken = action.payload
    },
    updateProfile: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(doLogin.fulfilled, (state, { payload }) => {
      state.role = payload.role;
    });
  },
});

export const {login, logout, persistGoogleIdToken, updateProfile} = userSlice.actions;
export default userSlice.reducer;
