import { createSlice } from '@reduxjs/toolkit';
import { fetchBackendConfig } from './thunk/fetch-backend-config.thunk';

type SystemState = {
  errorMessage: string;
  backendConfig: {
    maxBookingDateRange: number;
    maxDeviceBorrowQuantity: number;
    maxBookingRequestPerWeek: number;
    maxRoomCapacity: number
  };
};

const initialState: SystemState = {
  errorMessage: '',
  backendConfig: {
    maxBookingDateRange: 14,
    maxDeviceBorrowQuantity: 100,
    maxBookingRequestPerWeek: 3,
    maxRoomCapacity: 1000
  },
};
export const systemSlice = createSlice({
  name: 'system',
  initialState: initialState,
  reducers: {
    setSystemErrorMessage(state, action) {
      state.errorMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBackendConfig.fulfilled, (state, { payload }) => {
      state.backendConfig = payload;
    });
  },
});

export const systemReducer = systemSlice.reducer;
export const { setSystemErrorMessage } = systemSlice.actions;
