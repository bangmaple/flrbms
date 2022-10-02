import { createSlice } from '@reduxjs/toolkit';

interface SystemInitialState {
  isNotificationBellShown: boolean;
  quickAccessData: any[];
}

const initialState: SystemInitialState = {
  isNotificationBellShown: true,
  quickAccessData: [],
};

const systemSlice = createSlice({
  name: 'system',
  initialState: initialState,
  reducers: {
    toggleNotification(state, { payload }) {
      state.isNotificationBellShown = payload;
    },
    setQuickAccessData(state, { payload }) {
      state.quickAccessData = payload;
    },
  },
});

export const systemReducer = systemSlice.reducer;

export const { toggleNotification, setQuickAccessData } = systemSlice.actions;
