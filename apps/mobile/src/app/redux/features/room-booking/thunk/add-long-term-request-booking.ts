import { RequestDevice } from '../../../models/device-request.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../../constants/constant';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import { NewRequestBookingResponseModel } from '../../../models/new-request-booking-response.model';

interface RejectPayload {
  message: string;
}

interface AddNewLongTermRequestBookingPayload {
  checkinDate: string;
  checkoutDate: string;
  description: string;
  listDevice: RequestDevice[];
  bookingReasonId: string;
  roomId: string;
  checkinSlot: string;
  checkoutSlot: string;
}

export const addNewLongTermRequestBooking = createAsyncThunk<
  NewRequestBookingResponseModel,
  AddNewLongTermRequestBookingPayload,
  { rejectValue: RejectPayload }
>(
  'booking-room/add-new-long-term-request-booking',
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(toggleSpinnerOn());
    try {
      const response = await axios.post(
        `${API_URL}/booking-room/multi-booking`,
        {
          checkinDate: payload.checkinDate,
          checkoutDate: payload.checkoutDate,
          description: payload.description,
          listDevice: payload.listDevice,
          bookingReasonId: payload.bookingReasonId,
          roomId: payload.roomId,
          checkinSlot: payload.checkinSlot,
          checkoutSlot: payload.checkoutSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${LOCAL_STORAGE.getString('accessToken')}`,
          },
        }
      );
      return await response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: e.response.data,
      });
    } finally {
      thunkAPI.dispatch(toggleSpinnerOff());
    }
  }
);
