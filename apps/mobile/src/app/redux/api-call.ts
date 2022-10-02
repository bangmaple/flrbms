import axios, { AxiosError } from 'axios';
import { LOCAL_STORAGE } from '../utils/local-storage';
import { toggleSpinnerOff, toggleSpinnerOn } from './features/spinner';

export const axiosGetAPICall = async (url, params, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.get(url, {
      params: params,
      headers: {
        Authorization: LOCAL_STORAGE.getString('accessToken'),
      },
    });
    return await response.data;
  } catch (e: AxiosError | any) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
};

export const axiosPostAPICall = async (url, params, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.post(url, {
      params: params,
      headers: {
        Authorization: LOCAL_STORAGE.getString('accessToken'),
      },
    });
    return await response.data;
  } catch (e: AxiosError | any) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
};

export const axiosPutAPICall = async (url, body, params, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());

  try {
    const response = await axios.put(url, body, {
      params: params,
      headers: {
        Authorization: LOCAL_STORAGE.getString('accessToken'),
      },
    });
    return await response.data;
  } catch (e: AxiosError | any) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
};
