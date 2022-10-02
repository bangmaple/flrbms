import { createSlice } from '@reduxjs/toolkit';
import { fetchRoomById } from './thunk/fetch-room-by-id.thunk';
import { fetchAllRooms } from './thunk/fetch-all';
import { RoomModel } from '../../models/room.model';

interface InitialState {
  room: RoomModel;
  rooms: RoomModel[];
}

const initialState: InitialState = {
  room: {} as RoomModel,
  rooms: [],
};

const roomSlice = createSlice({
  name: 'room',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRoomById.fulfilled, (state, { payload }) => {
      state.room = payload;
    });
    builder.addCase(fetchAllRooms.fulfilled, (state, { payload }) => {
      state.rooms = payload;
    });
  },
});

export const roomReducer = roomSlice.reducer;
