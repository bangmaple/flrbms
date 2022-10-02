import { createSlice } from '@reduxjs/toolkit';
import FeedbackTypeModel from '../../models/feedback-type.model';
import { fetchAllFeedBackTypes } from './thunk/fetch-all-feed-back-types.thunk';

interface FeedbackTypeInitialState {
  feedbackTypes: FeedbackTypeModel[];
  feedbackType: FeedbackTypeModel;
}

const initialState: FeedbackTypeInitialState = {
  feedbackTypes: [],
  feedbackType: {} as FeedbackTypeModel,
}

const feedbackTypeSlice = createSlice({
  name: 'feedbackType',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllFeedBackTypes.fulfilled, (state, {payload}) => {
      state.feedbackTypes = payload;
    })
  },
  initialState: initialState,
});

export const feedbackTypeReducer = feedbackTypeSlice.reducer;

