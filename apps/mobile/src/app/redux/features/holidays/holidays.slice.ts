import { createSlice } from '@reduxjs/toolkit';
import {Holiday} from "../../models/holiday.model";
import {fetchHolidays} from "./thunk/fetch-holidays.thunk";


interface HolidayInitialState {
  holidays: Holiday[];
}

const initialState: HolidayInitialState = {
  holidays: [],
};

export const holidaysSlice = createSlice({
  initialState,
  name: 'holiday',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHolidays.fulfilled, (state, {payload}) => {
      state.holidays = payload;
    })
  },
});

export const holidaysReducer = holidaysSlice.reducer;
