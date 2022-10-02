import 'firebase/messaging';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: 'AIzaSyBu0hVHThHGd5OQLxQWnNZLSgdLGiYsfZE',
  authDomain: 'fptu-library-booking.firebaseapp.com',
  projectId: 'fptu-library-booking',
  storageBucket: 'fptu-library-booking.appspot.com',
  messagingSenderId: '1013204251190',
  appId: '1:1013204251190:web:52aeef762a7eb980e51e97',
  measurementId: 'G-MQLQ866QXQ',
};

initializeApp(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);
//const messaging = getMessaging(firebaseApp);

export const onMessageListener = () =>
  // eslint-disable-next-line no-undef
  new Promise((resolve) => {
    onMessage(undefined, (payload) => {
      resolve(payload);
    });
  });

export const getCloudMessagingToken = (setTokenFound) => {
  return getToken(undefined, {
    vapidKey:
      'BPp3wewLZaSNdM0RBvit3E5AbiW70TbxSMm_LxAgfZPUm8_00AT-apXGtiKLxJD3WaArROt1Ye9JUH99tTviwW8',
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        setTokenFound(true);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          'No registration token available. Request permission to generate one.'
        );
        setTokenFound(false);
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // catch error while creating client token
    });
};
