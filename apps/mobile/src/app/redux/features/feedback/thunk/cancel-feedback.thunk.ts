import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPutAPICall } from '../../../api-call';
import { API_URL } from '../../../../constants/constant';

interface RejectFeedbackPayload {
  id: string;
  replyMessage: string;
}

export const cancelFeedback = createAsyncThunk<
  void,
  RejectFeedbackPayload,
  {
    rejectValue: {
      message: string;
    };
  }
>('feedback/reject-feedback', async (payload, thunkAPI) => {
  return await axiosPutAPICall(
    `${API_URL}/feedbacks/reject/${payload.id}`,
    {
      replyMessage: payload.replyMessage,
    },
    undefined,
    thunkAPI
  );
});
