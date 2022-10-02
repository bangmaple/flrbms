import { createSlice } from '@reduxjs/toolkit';
import { PaginationResponse } from '../../../models/pagination-response.payload';
import { fetchRoles } from './thunk/fetch-roles.thunk';
import { fetchRoleById } from './thunk/fetch-role-by-id.thunk';
import { Role } from '../../../models/role.model';
import { fetchDeletedRoles } from './thunk/fetch-deleted-role.thunk';

interface InitialState {
  roles: PaginationResponse<Role>;
  role: Role;
  deletedRoles: Role[];

}

const initialState: InitialState = {
  roles: {} as PaginationResponse<Role>,
  role: {} as Role,
  deletedRoles: [],

};

export const roleSlice = createSlice({
  name: 'role',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRoles.fulfilled, (state, { payload }) => {
      state.roles = payload;
    });
    builder.addCase(fetchRoleById.fulfilled, (state, { payload }) => {
      state.role = payload;
    });
    builder.addCase(fetchDeletedRoles.fulfilled, (state, { payload }) => {
      state.deletedRoles = payload;
    });
  },
});

export const roleReducer = roleSlice.reducer;
