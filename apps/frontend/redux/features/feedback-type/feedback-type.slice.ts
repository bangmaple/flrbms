import {createSlice} from '@reduxjs/toolkit';
import {FeedbackType} from '../../../models/feedback-type.model';
import {PaginationResponse} from '../../../models/pagination-response.payload';
import {fetchFeedbackTypes} from './thunk/fetch-feedback-types.thunk'
import {fetchFeedbackTypeById} from './thunk/fetch-feedback-type-by-id.thunk';
import {fetchDisabledFeedbackTypes} from './thunk/fetch-disabled-feedback-types'

interface InitialState {
  feedbackTypes: PaginationResponse<FeedbackType>;
  feedbackType: FeedbackType;
  disabledFeedbackTypes: FeedbackType[];
}

const initialState: InitialState = {
  feedbackTypes: {} as PaginationResponse<FeedbackType>,
  feedbackType: {} as FeedbackType,
  disabledFeedbackTypes: [],
}

export const feedbackTypeSlice = createSlice({
  name: 'feedbackType',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeedbackTypes.fulfilled, (state, {payload}) => {
      state.feedbackTypes = payload;
    });
    builder.addCase(fetchFeedbackTypeById.fulfilled, (state, {payload}) => {
      state.feedbackType = payload;
    });
    // builder.addCase(fetchDisabledRoomTypes.fulfilled, (state, { payload }) => {
    //   state.disabledRoomTypes = payload;
    // });
    builder.addCase(fetchDisabledFeedbackTypes.fulfilled, (state, {payload}) => {
      state.disabledFeedbackTypes = payload;
    });
  },
});

export const feedbackTypeReducer = feedbackTypeSlice.reducer;
