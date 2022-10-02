import { createSlice } from '@reduxjs/toolkit';
import { BookingRoom } from '../../models/booking-room.model';
import { fetchAllBookingRooms } from './thunk/fetch-all';
import { fetchAllWishlistRooms } from './thunk/fetch-all-wishlist.thunk';
import { RoomWishListResponse } from '../../models/wishlist-booking-room.model';
import { fetchBookingRoomDevices } from './thunk/fetch-booking-room-devices.thunk';
import { Device } from '../../models/device.model';
import { fetchChoosingBookingRoom } from './thunk/fetch-choosing-booking-room.thunk';
import { ChoosingBookingRoom } from '../../models/choosing-booking-room.model';
import { CurrentBookingRoom } from '../../models/current-booking-room.model';
import { fetchCurrentBookingRoomList } from './thunk/fetch-current-booking-list.thunk';
import { fetchCurrentRoomBookingDetail } from './thunk/fetch-current-booking-detail.thunk';
import { fetchRoomBookingById } from './thunk/fetch-room-booking-by-id.thunk';
import { fetchBookingRoomsByFilters } from './thunk/fetch-booking-room-by-filters.thunk';
import { BookingRoomsByFiltersResponse } from '../../models/booking-rooms-by-filters-response.model';
import dayjs from 'dayjs';
import { addNewRequestBooking } from './thunk/add-new-request-booking';
import { NewRequestBookingResponseModel } from '../../models/new-request-booking-response.model';
import { fetchCurrentCheckoutInformation } from './thunk/fetch-current-checkout-information.thunk';
import { CurrentCheckinInformation } from '../../models/current-checkin-information.model';
import { fetchCurrentCheckinInformation } from './thunk/fetch-current-checkin-information.thunk';
import { fetchDeviceInUseByBookingRequestId } from './thunk/fetch-devices-in-use-by-booking-request-id.thunk';
import { fetchRoomFreeByMultiSlotAndDay } from './thunk/fetch-room-free-by-multi-day-and-slot.thunk';
import { addNewLongTermRequestBooking } from './thunk/add-long-term-request-booking';
import { checkOverSlot } from './thunk/check-over-slot.thunk';
import { cancelBookingRoom } from './thunk/cancel-room-booking.thunk';
import {getRoomNameBookedSameSlot} from "./thunk/get-room-name-booked-same-slot.thunk";

interface RoomBookingState {
  roomBookingCheckout: RoomBookingCheckout;
  bookingRoom: BookingRoom;
  bookingRooms: BookingRoom[];
  wishlistBookingRooms: RoomWishListResponse[];
  choosingBookingRooms: ChoosingBookingRoom[];
  devices: Device[];
  addRoomBooking: AddRoomBookingPayload;
  currentBookingRooms: CurrentBookingRoom[];
  currentBookingRoom: CurrentBookingRoom;
  today: string;
  filteredBookingRequests: BookingRoomsByFiltersResponse[];
  globalDateStart: string;
  globalDateEnd: string;
  response: NewRequestBookingResponseModel;
  currentCheckinInformation: CurrentCheckinInformation;
}

interface BookingDevice {
  value: string;
  quantity: number;
  label: string;
}

interface Room {
  id: string;
  name: string;
  description: string;
  type: string;
}

interface AddRoomBookingPayload {
  fromDay: string;
  toDay: string;
  fromSlot: string;
  fromSlotName: string;
  toSlotName: string;
  toSlot: string;
  toSlotNum: number;
  fromSlotNum: number;
  roomId: string;
  roomName: string;
  devices: BookingDevice[];
  deviceNames: string[];
  isMultiSlot: boolean;
  isMultiDate: boolean;
  rooms: Room[];
  isMultiLongTerm: boolean;
}

interface RoomBookingCheckout {
  id: string;
  description: string;
  status: string;
  bookingReason: string;
  requestedBy: string;
  requestedAt: string;
  acceptedBy: string;
  acceptedAt: string;
  checkinSlot: number;
  checkoutSlot: number;
  checkinTime: string;
  checkoutTime: string;
  checkedInAt: string;
  roomName: string;
  roomType: string;
  checkinDate: string;
  listDevice: Device[]
}

const initialState: RoomBookingState = {
  roomBookingCheckout: {} as RoomBookingCheckout,
  globalDateStart: dayjs(new Date()).format('YYYY-MM-DD'),
  globalDateEnd: dayjs(dayjs().endOf('year')).format('YYYY-MM-DD'),
  filteredBookingRequests: [],
  bookingRoom: {} as BookingRoom,
  bookingRooms: [],
  wishlistBookingRooms: [],
  devices: [],
  choosingBookingRooms: [],
  addRoomBooking: {} as AddRoomBookingPayload,
  currentBookingRooms: [],
  currentBookingRoom: {} as CurrentBookingRoom,
  today: '',
  response: {} as NewRequestBookingResponseModel,
  currentCheckinInformation: {} as CurrentCheckinInformation,
};

const roomBookingSlice = createSlice({
  name: 'room-booking',
  initialState: initialState,
  reducers: {
    saveToday(state, { payload }) {
      state.today = payload;
    },
    saveStartDay(state, { payload }) {
      state.addRoomBooking = {
        ...state.addRoomBooking,
        fromDay: payload.fromDay,
      };
    },
    saveEndDay(state, { payload }) {
      state.addRoomBooking = {
        ...state.addRoomBooking,
        toDay: payload.toDay,
      };
    },
    saveToSlot(state, { payload }) {
      state.addRoomBooking = {
        ...state.addRoomBooking,
        toSlotName: payload.toSlotName,
      };
    },
    saveMultiSlot(state, { payload }) {
      state.addRoomBooking = {
        ...state.addRoomBooking,
        isMultiSlot: payload.isMultiSLot,
      };
    },
    saveFromSlotNum(state, { payload }) {
      state.addRoomBooking = {
        ...state.addRoomBooking,
        fromSlotNum: payload.fromSlotNum,
      };
    },
    saveToSlotNum(state, { payload }) {
      state.addRoomBooking = {
        ...state.addRoomBooking,
        toSlotNum: payload.toSlotNum,
      };
    },
    step1ScheduleRoomBooking(state, { payload }) {
      state.addRoomBooking = {
        ...state.addRoomBooking,
        roomId: payload.roomId,
        roomName: payload.roomName,
        fromDay: payload.fromDay,
        fromSlot: payload.fromSlot,
        toSlot: payload.toSlot,
        isMultiSlot: payload.isMultiSlotChecked,
      };
    },
    step2ScheduleRoomBooking(state, { payload }) {
      state.addRoomBooking = {
        ...state.addRoomBooking,
        roomId: payload.roomId,
        roomName: payload.roomName,
      };
    },
    step3ScheduleRoomBooking(state, { payload }) {
      state.addRoomBooking = {
        ...state.addRoomBooking,
        devices: payload.devices,
        deviceNames: payload.deviceNames,
      };
    },
    step1BookRoomFromWishList(state, { payload }) {
      state.addRoomBooking = {
        ...state.addRoomBooking,
        roomId: payload.roomId,
        roomName: payload.roomName,
        fromSlot: payload.fromSlot,
        toSlotNum: payload.toSlotNum,
        toSlot: payload.toSlot,
      };
    },
    setGlobalDateStart(state, { payload }) {
      state.globalDateStart = payload;
    },
    setGlobalDateEnd(state, { payload }) {
      state.globalDateEnd = payload;
    },
    resetGlobalDateStart(state) {
      state.globalDateStart = dayjs(new Date()).format('YYYY-MM-DD');
    },
    resetGlobalDateEnd(state) {
      state.globalDateEnd = dayjs(dayjs().endOf('year')).format('YYYY-MM-DD');
    },
    step1BookingLongTerm(state, { payload }) {
      state.addRoomBooking = {
        ...state.addRoomBooking,
        roomId: payload.roomId,
        roomName: payload.roomName,
        fromDay: payload.fromDay,
        fromSlot: payload.fromSlot,
        toSlot: payload.toSlot,
        isMultiLongTerm: payload.isMultiLongTerm,
      };
    },
    saveMultiDate(state, { payload }) {
      state.addRoomBooking = {
        ...state.addRoomBooking,
        isMultiDate: payload.isMultiDate,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllBookingRooms.fulfilled, (state, { payload }) => {
      state.bookingRooms = payload;
    });
    builder.addCase(addNewRequestBooking.fulfilled, (state, { payload }) => {
      state.response = payload;
    });
    builder.addCase(
      addNewLongTermRequestBooking.fulfilled,
      (state, { payload }) => {
        state.response = payload;
      }
    );
    builder.addCase(fetchAllWishlistRooms.fulfilled, (state, { payload }) => {
      state.wishlistBookingRooms = payload;
    });
    builder.addCase(fetchBookingRoomDevices.fulfilled, (state, { payload }) => {
      state.devices = payload;
    });
    builder.addCase(
      fetchChoosingBookingRoom.fulfilled,
      (state, { payload }) => {
        state.choosingBookingRooms = payload;
      }
    );
    builder.addCase(
      fetchCurrentBookingRoomList.fulfilled,
      (state, { payload }) => {
        state.currentBookingRooms = payload;
      }
    );
    builder.addCase(
      fetchCurrentRoomBookingDetail.fulfilled,
      (state, { payload }) => {
        state.currentBookingRoom = payload;
      }
    );
    builder.addCase(fetchRoomBookingById.fulfilled, (state, { payload }) => {
      state.bookingRoom = payload;
    });
    builder.addCase(
      fetchBookingRoomsByFilters.fulfilled,
      (state, { payload }) => {
        state.filteredBookingRequests = payload;
      }
    );
    builder.addCase(
      fetchCurrentCheckoutInformation.fulfilled,
      (state, { payload }) => {
        state.roomBookingCheckout = payload;
      }
    );
    builder.addCase(
      fetchCurrentCheckinInformation.fulfilled,
      (state, { payload }) => {
        state.currentCheckinInformation = payload;
      }
    );
    builder.addCase(
      fetchDeviceInUseByBookingRequestId.fulfilled,
      (state, { payload }) => {
        state.currentCheckinInformation.devices = payload;
      }
    );
    builder.addCase(
      fetchRoomFreeByMultiSlotAndDay.fulfilled,
      (state, { payload }) => {
        state.addRoomBooking.rooms = payload;
      }
    );
    builder.addCase(checkOverSlot.fulfilled, (state, { payload }) => {});
    builder.addCase(cancelBookingRoom.fulfilled, (state, { payload }) => {});
    builder.addCase(getRoomNameBookedSameSlot.fulfilled,(state, { payload }) => {});
  },
});

export const roomBookingReducer = roomBookingSlice.reducer;

export const {
  step1ScheduleRoomBooking,
  step2ScheduleRoomBooking,
  step3ScheduleRoomBooking,
  saveStartDay,
  saveEndDay,
  saveToday,
  saveToSlot,
  saveFromSlotNum,
  saveToSlotNum,
  setGlobalDateStart,
  setGlobalDateEnd,
  resetGlobalDateStart,
  resetGlobalDateEnd,
  step1BookRoomFromWishList,
  step1BookingLongTerm,
  saveMultiDate,
} = roomBookingSlice.actions;
