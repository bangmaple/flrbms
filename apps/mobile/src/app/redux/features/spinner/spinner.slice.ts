import { createSlice } from '@reduxjs/toolkit';
import { spinnerInitialState } from './spinnerInitialState';

const spinnerSlice = createSlice({
  name: 'spinner',
  initialState: spinnerInitialState,
  reducers: {
    toggleSpinnerOn: (state) => {
      state.isLoading = true;
    },
    toggleSpinnerOff: (state) => {
      state.isLoading = false;
    },
  },
});

export const spinnerReducer = spinnerSlice.reducer;
export const {toggleSpinnerOn, toggleSpinnerOff} = spinnerSlice.actions;
