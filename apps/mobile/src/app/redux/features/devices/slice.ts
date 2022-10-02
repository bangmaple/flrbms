import { createSlice } from '@reduxjs/toolkit';
import { Device } from '../../models/device.model';
import { fetchAllDevices } from './thunk/fetch-all';

interface DevicesState {
  devices: Device[];
}

const initialState: DevicesState = {
  devices: [],
};

const devicesSlice = createSlice({
  name: 'device',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllDevices.fulfilled, (state, { payload }) => {
      state.devices = payload;
    });
  },
});

export const deviceReducer = devicesSlice.reducer;
