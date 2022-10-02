import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosGetAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';
import { RoomModel } from '../../../models/room.model';

interface RequestPayload {
  roomId: string;
}

export const fetchRoomById = createAsyncThunk<
  RoomModel,
  RequestPayload,
  {
    rejectValue: {
      message: string;
    };
  }
>('room/fetch-by-id', async (payload, thunkAPI) => {
  return await axiosGetAPICall(
    `${API_URL}/rooms/find/${payload.roomId}`,
    undefined,
    thunkAPI
  );
});
