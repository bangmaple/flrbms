import { createSlice } from '@reduxjs/toolkit';
import { fetchFeedbacks } from './thunk/fetch-feedback';
import { fetchFeedbackById } from './thunk/fetch-feedback-by-id.thunk';
import { Feedback } from '../../../models/feedback.model';
import { PaginationResponse } from '../../../models/pagination-response.payload';

interface InitialState {
  feedbacks: PaginationResponse<Feedback>;
  feedback: Feedback;
}

const initialState: InitialState = {
  feedbacks: {} as PaginationResponse<Feedback>,
  feedback: {} as Feedback,
};

export const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeedbacks.fulfilled, (state, { payload }) => {
      state.feedbacks = payload;
    });

    builder.addCase(fetchFeedbackById.fulfilled, (state, { payload }) => {
      state.feedback = payload;
    });
  },
});

export const feedbackReducer = feedbackSlice.reducer;
