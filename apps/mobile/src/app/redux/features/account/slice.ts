import { createSlice } from '@reduxjs/toolkit';
import { UpdateAccountResponseModel } from '../../models/update-account-response.model';
import { doUpdateProfile } from './thunk/update.thunk';
import { doChangePassword } from './thunk/changePassword.thunk';

interface AccountState {
  selectedAccount: UpdateAccountResponseModel;
}

const initialState: AccountState = {
  selectedAccount: {} as UpdateAccountResponseModel,
};

const accountSlice = createSlice({
  name: 'account',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(doUpdateProfile.fulfilled, (state, { payload }) => {
      state.selectedAccount = payload;
    });
    builder.addCase(doChangePassword.fulfilled, (state, { payload }) => {});
  },
});

export const accountReducer = accountSlice.reducer;
