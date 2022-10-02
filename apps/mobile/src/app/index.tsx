import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { makeStore } from './redux/store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';

GoogleSignin.configure({
  iosClientId:
    '1013204251190-74m7mtno9e3ge4fdie3422hotor5217c.apps.googleusercontent.com',
  webClientId:
    '1013204251190-nkd63gan2a17tj8lffmh83jl6scco9g6.apps.googleusercontent.com',

  offlineAccess: false,
});
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

export const Index = () => {
  return (
    <Provider store={makeStore()}>
      <App />
    </Provider>);
};
