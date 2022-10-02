import {createAsyncThunk} from "@reduxjs/toolkit";
import {toggleSpinnerOff, toggleSpinnerOn} from "../../spinner";
import axios from "axios";
import {API_URL} from "../../../../constants/constant";

interface RejectValue {
  message: string
}

interface RequestPayload {
  fcmToken: string
}

export const saveFCMToken = createAsyncThunk<
  void,
  RequestPayload,
  {
    rejectValue: RejectValue
  }
  >('account/save-fcmToken', async (payload, thunkAPI) => {
    thunkAPI.dispatch(toggleSpinnerOn())
  try {
    const response = await axios.put(`${API_URL}/accounts/save-fcmtoken`, {
      fcmToken: payload.fcmToken
    })
    return await response.data;
  } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data.message)
  }finally {
    thunkAPI.dispatch(toggleSpinnerOff())
  }
})
