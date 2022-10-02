import { createSlice } from '@reduxjs/toolkit';
import { RoomType } from '../../../models/room-type.model';
import { PaginationResponse } from '../../../models/pagination-response.payload';
import { fetchRoomTypes } from './thunk/fetch-room-types.thunk';
import { fetchRoomTypeById } from './thunk/fetch-room-type-by-id.thunk';
import { fetchDeletedRoomTypes } from './thunk/fetch-deleted-room-types';

interface InitialState {
  roomTypes: PaginationResponse<RoomType>;
  roomType: RoomType;
  deletedRoomTypes: RoomType[];
}

const initialState: InitialState = {
  roomTypes: {} as PaginationResponse<RoomType>,
  roomType: {} as RoomType,
  deletedRoomTypes: [],
};

export const roomTypeSlice = createSlice({
  name: 'roomType',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRoomTypes.fulfilled, (state, { payload }) => {
      state.roomTypes = payload;
    });
    builder.addCase(fetchRoomTypeById.fulfilled, (state, { payload }) => {
      state.roomType = payload;
    });
    // builder.addCase(fetchDisabledRoomTypes.fulfilled, (state, { payload }) => {
    //   state.disabledRoomTypes = payload;
    // });
    builder.addCase(fetchDeletedRoomTypes.fulfilled, (state, { payload }) => {
      state.deletedRoomTypes = payload;
    });
  },
});

export const roomTypeReducer = roomTypeSlice.reducer;
