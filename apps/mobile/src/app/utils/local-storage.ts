import { MMKV } from 'react-native-mmkv';

export const LOCAL_STORAGE = new MMKV();

export const STORAGE_KEY = {
  FCM_TOKEN: 'fcmToken'
}

export const useStorage = (key: string, defaultValue = undefined) => {
  return LOCAL_STORAGE.getString(key);
};

export const isUserSessionExisted = () => LOCAL_STORAGE.contains('accessToken');

export const revokeUserSession = () => {
  LOCAL_STORAGE.delete('accessToken');
  LOCAL_STORAGE.delete('refreshToken');
  LOCAL_STORAGE.delete('user');
};

export const LocalStorageKeys = {
  authenticatedUser: 'user',
};
