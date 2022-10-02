import { LOCAL_STORAGE } from './local-storage';
import { DEFAULT_QUICK_ACCESS } from '../constants/quick-access-navigation.constant';
import {
  setQuickAccessData,
  toggleNotification,
} from '../redux/features/system/system.slice';
import { toggleSpinnerOff, toggleSpinnerOn } from '../redux/features/spinner';
import axios from 'axios';
import { API_URL } from '../constants/constant';

export const fetchGlobalQuickAccessData = (dispatch) => {
  if (!LOCAL_STORAGE.contains('QUICK_ACCESS')) {
    LOCAL_STORAGE.set('QUICK_ACCESS', JSON.stringify(DEFAULT_QUICK_ACCESS));
    dispatch(setQuickAccessData([]));
  } else {
    dispatch(
      setQuickAccessData(JSON.parse(LOCAL_STORAGE.getString('QUICK_ACCESS')))
    );
  }
};

export const fetchNotificationBellStatus = (dispatch) => {
  if (!LOCAL_STORAGE.contains('NOTIFICATION_BELL')) {
    LOCAL_STORAGE.set('NOTIFICATION_BELL', true);
  } else {
    dispatch(
      toggleNotification(
        LOCAL_STORAGE.getBoolean('NOTIFICATION_BELL').valueOf()
      )
    );
  }
};

export const checkIfServerIsAlive = (dispatch, setPingTimedOut) => {
  dispatch(toggleSpinnerOn());
  axios
    .get(`${API_URL}/health`, {
      timeout: 1500,
    })
    .catch((e) => {
      setPingTimedOut(true);
    })
    .finally(() => dispatch(toggleSpinnerOff()));
};
