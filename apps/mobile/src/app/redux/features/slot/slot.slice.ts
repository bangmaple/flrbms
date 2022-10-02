import { createSlice } from '@reduxjs/toolkit';
import { Slot } from '../../models/slot.model';
import { fetchAllSlots } from './thunk/fetch-all-slots.thunk';
import {fetchSlots} from "./thunk/fetchSlots.thunk";

interface NewSlot {

}

interface SlotInitialState {
  slots: Slot[];
  slot: Slot;
  newSlots: any;
}

const initialState: SlotInitialState = {
  slots: [],
  slot: {} as Slot,
  newSlots: {} as any,
}

const slotSlice = createSlice({
  name: 'slot',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllSlots.fulfilled, (state, {payload}) => {
      state.slots = payload;
    });
    builder.addCase(fetchSlots.fulfilled, (state, {payload}) => {
      state.newSlots = payload;
    });
  },
  initialState: initialState,
});

export const slotReducer = slotSlice.reducer;

