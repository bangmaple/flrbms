import { createSlice } from '@reduxjs/toolkit';
import { fetchFeedbacks } from './thunk/fetch-feedbacks.thunk';
import { FeedbackModel } from '../../models/feedback.model';
import { fetchFeedbackById } from './thunk/fetch-feedback-by-id.thunk';
import { addNewFeedbackAfterCheckout } from './thunk/Add-new-feedback-after-checkout.thunk';

interface FeedbackResponse {
  feedbackMessage: string;
  rateNum: number;
  bookingRoomId: string;
  createdBy: string;
  createdAt: string;
  id: string;
}

interface FeedbackState {
  feedback: FeedbackModel;
  feedbacks: FeedbackFilterResponse[];
  feedbackCheckout: FeedbackResponse;
}

const initialState: FeedbackState = {
  feedback: {} as FeedbackModel,
  feedbacks: [],
  feedbackCheckout: {} as FeedbackResponse,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeedbackById.fulfilled, (state, { payload }) => {
      state.feedback = payload;
    });
    builder.addCase(fetchFeedbacks.fulfilled, (state, { payload }) => {
      state.feedbacks = payload;
    });
    builder.addCase(
      addNewFeedbackAfterCheckout.fulfilled,
      (state, { payload }) => {
        state.feedbackCheckout = payload;
      }
    );
  },
});

export const feedbackReducer = feedbackSlice.reducer;
