import {createSlice} from "@reduxjs/toolkit";

interface SpinnerState {
  isEnabled: boolean,
};

const initialState: SpinnerState = {
  isEnabled: false,
};

const spinnerSlice = createSlice({
  name: 'spinner',
  initialState,
  reducers: {
    toggleSpinnerOn(state) {
      state.isEnabled = true;
    },
    toggleSpinnerOff(state) {
      state.isEnabled = false;
    }
  }
});

export const {toggleSpinnerOff, toggleSpinnerOn} = spinnerSlice.actions;
export default spinnerSlice;
