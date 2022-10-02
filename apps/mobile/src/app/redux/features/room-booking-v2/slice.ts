import { createSlice } from '@reduxjs/toolkit';
import { fetchBookedRequestByDayAndSlot } from './thunk/fetch-booked-request.thunk';
import { BookedRequest } from '../../models/booked-request.model';

export interface AutoBookingRequestDevice {
  id: string;
  name: string;
  quantity: number;
}

export interface AutoBookingRequest {
  id: number,
  timeStart: string,
  timeEnd: string,
  date: string,
  capacity: number,
  devices: AutoBookingRequestDevice[]
}

export interface AutoBookingRequestPayload {
  description: string,
  bookingReasonId: string,
  requests: AutoBookingRequest[],
}
////


interface BookedRequestInitialState {
  bookedRequests: BookedRequest[];
  bookedRequest: BookedRequest;
  request: AutoBookingRequestPayload;
  bookingRequestId: number;
  isAllRequestsSameDevices: boolean;
  providedDevices: {id: string; quantity: number}[]
}

const initialState: BookedRequestInitialState = {
  request: {
    bookingReasonId: '',
    description: '',
    requests: []
  },
  bookedRequests: [],
  bookedRequest: {} as BookedRequest,
  bookingRequestId: 0,
  isAllRequestsSameDevices: false,
  providedDevices: undefined
};

const bookedRequestSlice = createSlice({
  name: 'bookedRequest',
  initialState: initialState,
  extraReducers: (builder => {
    builder.addCase(fetchBookedRequestByDayAndSlot.fulfilled, (state, {payload}) => {
      state.bookedRequests = payload
    })
  }),
  reducers: {
    updateBookingRequestId(state, {payload}) {
      state.bookingRequestId = payload;
    },
    updateAutoBookingRequest(state, {payload}) {
      state.request = {
        ...state.request,
        ...payload
      }
    },
    turnOffRequestsSameDevices(state, {payload}) {
      state.isAllRequestsSameDevices = false;
    },
    turnOnRequestsSameDevices(state, {payload}) {
      state.isAllRequestsSameDevices = true;
    },
    handleSetProvidedDevices(state, {payload}) {
      state.providedDevices = payload;
    }
  },
});

export const bookedRequestReducer = bookedRequestSlice.reducer;

export const {updateAutoBookingRequest, updateBookingRequestId, turnOffRequestsSameDevices, turnOnRequestsSameDevices,
  handleSetProvidedDevices} = bookedRequestSlice.actions;

