import { createSlice } from '@reduxjs/toolkit';
import { DeviceType } from '../../../models/device-type.model';
import { PaginationResponse } from '../../../models/pagination-response.payload';
import { fetchDeviceTypes } from './thunk/fetch-device-types.thunk';
import { fetchDeviceTypeById } from './thunk/fetch-device-type-by-id.thunk';
import { fetchDeletedDeviceTypes } from './thunk/fetch-deleted-device-types';

interface InitialState {
  deviceTypes: PaginationResponse<DeviceType>;
  deviceType: DeviceType;
  deletedDeviceTypes: DeviceType[];

}

const initialState: InitialState = {
  deviceTypes: {} as PaginationResponse<DeviceType>,
  deviceType: {} as DeviceType,
  deletedDeviceTypes: [],

};

export const deviceTypeSlice = createSlice({
  name: 'device-type',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDeviceTypes.fulfilled, (state, { payload }) => {
      state.deviceTypes = payload;
    });
    builder.addCase(fetchDeviceTypeById.fulfilled, (state, { payload }) => {
      state.deviceType = payload;
    });
    builder.addCase(fetchDeletedDeviceTypes.fulfilled, (state, { payload }) => {
      state.deletedDeviceTypes = payload;
    });
  },
});

export const deviceTypeReducer = deviceTypeSlice.reducer;
