import { createSlice } from '@reduxjs/toolkit';
import { fetchAccounts } from './thunk/fetch-accounts.thunk';
import { fetchAccountById } from './thunk/fetch-by-id.thunk';
import { PaginationResponse } from '../../../models/pagination-response.payload';
import { Account } from '../../../models/account.model';
import { fetchDisabledAccounts } from './thunk/fetch-disabled.thunk';
import { fetchDeletedAccounts } from './thunk/fetch-deleted.thunk';
import { fetchListusernames } from './thunk/fetch-user-names.thunk';

// import { updateRoomBookingById } from "./thunk/update-room-booking-by-id";
// import { addRoomBooking } from "./thunk/add-room-booking";

interface InitialState {
  accounts: PaginationResponse<Account>;
  account: Account;
  disabledAccounts: Account[];
  deletedAccounts: Account[];
  userNames: { value: string; label: string }[];
}

const initialState: InitialState = {
  accounts: {} as PaginationResponse<Account>,
  account: {} as Account,
  disabledAccounts: [],
  deletedAccounts: [],
  userNames: [],
};

export const accountSlice = createSlice({
  name: 'account',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAccounts.fulfilled, (state, { payload }) => {
      state.accounts = payload;
    });

    builder.addCase(fetchAccountById.fulfilled, (state, { payload }) => {
      state.account = payload;
    });
    builder.addCase(fetchDisabledAccounts.fulfilled, (state, { payload }) => {
      state.disabledAccounts = payload;
    });
    builder.addCase(fetchDeletedAccounts.fulfilled, (state, { payload }) => {
      state.deletedAccounts = payload;
    });
    builder.addCase(fetchListusernames.fulfilled, (state, { payload }) => {
      state.userNames = payload;
    });
  },
});

export const accountReducer = accountSlice.reducer;
