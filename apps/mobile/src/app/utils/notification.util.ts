import {LOCAL_STORAGE, STORAGE_KEY} from "./local-storage";
import messaging from "@react-native-firebase/messaging";
import {addUserAfterCloseApp} from "../redux/features/auth/slice";

const ERROR_FETCHING_FCM_TOKEN = "Error while fetching FCM Token";

export const handleSetupDeviceNotificationPermission = () => {
  requestUserNotificationPermission().then(() => {
    registerNotificationListener();
    getFCMToken();
  });
}
export const getFCMToken = async () => {
  const fcmToken = LOCAL_STORAGE.getString(STORAGE_KEY.FCM_TOKEN);
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        LOCAL_STORAGE.set('fcmToken', fcmToken);
      }
    } catch (e) {
    }
  }
};

export const registerNotificationListener = () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      'notification caused app to open from background state: ',
      remoteMessage.notification
    );
  });

  messaging().onMessage(async (remoteMessage) => {
    console.log('notification on foreground state ', remoteMessage);
  });
};

export const requestUserNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

};

const isCurrentUserEmpty = (user) => {
  for (const prop in user) {
    if (Object.prototype.hasOwnProperty.call(user, prop)) {
      return false;
    }
  }
};

export const updateUserFCMToken = (dispatch, authUser) => {
  if (!isCurrentUserEmpty(authUser)) {
    const user = LOCAL_STORAGE.getString('user');
    if (typeof user !== 'undefined') {
      dispatch(addUserAfterCloseApp(JSON.parse(user)));
    }
  }
}
