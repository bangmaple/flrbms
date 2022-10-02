import {createAsyncThunk} from "@reduxjs/toolkit";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import axios from "axios";
import {FeedbackType} from "../../../../models/feedback-type.model"


interface RejectValue {
  message: string;
}

export const fetchDisabledFeedbackTypes = createAsyncThunk<FeedbackType[], string, {
  rejectValue: RejectValue
}>('feedback-types/fetch-disabled', async (payload = "", thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.get(`/api/feedback-types/disabled?search=${payload}`);
    return await response.data;
  } catch ({response}) {
    if (response.status === 401 || response.status === 403) {
      return thunkAPI.rejectWithValue({
        message: 'Access token is invalid'
      })
    }
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
