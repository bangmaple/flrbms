import {createSlice} from "@reduxjs/toolkit";
import {Room} from "../../../models/room.model";
import {getRoomById} from "./thunk/get-room-by-id";
import { disableRoomById } from "./thunk/disable-room-by-id";
import { fetchRooms } from "./thunk/fetch-rooms";
import { updateRoomById } from "./thunk/update-room-by-id";
import { addRoom } from "./thunk/add-room";
import { fetchDisabledRooms } from "./thunk/fetch-disabled-rooms";
import { fetchDeletedRooms } from "./thunk/fetch-deleted-rooms";
import { restoreDisabledRoom } from "./thunk/restore-disabled.thunk";
import { deleteRoomById } from "./thunk/delete-room-by-id";
import { PaginationResponse } from '../../../models/pagination-response.payload';

interface InitialState {
  rooms: PaginationResponse<Room>;
  room: Room;
  disabledRooms: Room[];
  deletedRooms: Room[];

}

const initialState: InitialState = {
  rooms: {} as PaginationResponse<Room>,
  room: {} as Room,
  disabledRooms: [],
  deletedRooms: [],

};

export const roomSlice = createSlice({
  name: 'roomType',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRoomById.fulfilled, (state, { payload }) => {
      state.room = payload;
    });
    builder.addCase(getRoomById.rejected, (state, {payload}) => {

    });

    builder.addCase(disableRoomById.pending, (state) => {

    });

    builder.addCase(disableRoomById.fulfilled, (state, {payload}) => {

    });

    builder.addCase(disableRoomById.rejected, (state, {payload}) => {

    });

    builder.addCase(fetchRooms.fulfilled, (state, { payload }) => {
      state.rooms = payload;
    });

    builder.addCase(fetchRooms.rejected, (state, {payload}) => {

    });

    builder.addCase(updateRoomById.fulfilled, (state, {payload}) => {

    });

    builder.addCase(addRoom.fulfilled, (state, {payload}) => {

    });

    builder.addCase(addRoom.rejected, (state, {payload}) => {

    });

    builder.addCase(fetchDisabledRooms.fulfilled, (state, {payload}) => {
        state.disabledRooms = payload;
    });
    builder.addCase(fetchDeletedRooms.fulfilled, (state, {payload}) => {
      state.deletedRooms = payload;
    });
    builder.addCase(restoreDisabledRoom.fulfilled, (state, {payload}) => {
      return;

    });
    builder.addCase(deleteRoomById.fulfilled, (state, {payload}) => {
      return;
    });
  }

});

export const roomReducer = roomSlice.reducer;
