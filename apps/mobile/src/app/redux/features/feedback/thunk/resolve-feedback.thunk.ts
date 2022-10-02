import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPutAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

interface ResolveFeedbackPayload {
  id: string;
  replyMessage: string;
}

export const resolveFeedback = createAsyncThunk<void, ResolveFeedbackPayload, {
  rejectValue: {
    message: string;
  }
}>("feedback/resolve-feedback", async (payload, thunkAPI) => {
  return await axiosPutAPICall(`${API_URL}/feedbacks/resolve/${payload.id}`, {
    replyMessage: payload.replyMessage
  }, undefined, thunkAPI);

});
