import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator, StackScreen } from '@app/utils';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import LoginScreen from './screens/login.screen';
import MainNavigator from './navigation/main.navigator';
import { Spinner } from './components/spinners/spinner';
import CannotConnectToServer from './components/cannot-connect-server.component';
import { useAppDispatch } from './hooks/use-app-dispatch.hook';
import { useAppSelector } from './hooks/use-app-selector.hook';
import {
  handleSetupDeviceNotificationPermission, updateUserFCMToken,
} from "./utils/notification.util";
import {checkIfServerIsAlive, fetchGlobalQuickAccessData, fetchNotificationBellStatus} from "./utils/app.util";
import {NotificationModal} from "./components/notification-modal.component";

export const App = () => {
  const isSpinnerLoading = useSelector(
    (state: RootState) => state.spinner.isLoading
  );
  const dispatch = useAppDispatch();
  const [isPingTimedOut, setPingTimedOut] = useState<boolean>(false);
  const authUser = useAppSelector((state) => state.auth.authUser);

  useEffect(() => {
    checkIfServerIsAlive(dispatch, setPingTimedOut);
    handleSetupDeviceNotificationPermission();
    fetchGlobalQuickAccessData(dispatch);
    fetchNotificationBellStatus(dispatch);
    updateUserFCMToken(dispatch, authUser);
  }, []);

  const navigationRef = React.useRef();

  return isPingTimedOut ? (
    <CannotConnectToServer
      isShown={isPingTimedOut}
      toggleShown={() => setPingTimedOut(false)}
    />
  ) : (
    <>
      <StatusBar barStyle="dark-content" />
      {/* <NotificationModal navigation={navigationRef?.current}/>*/}
      <NavigationContainer ref={navigationRef}>
        <StackNavigator
          initialRouteName={'LOGIN_SCREEN'}
          screenOptions={{
            headerShown: false,
          }}
        >
          <StackScreen name={'LOGIN_SCREEN'} component={LoginScreen} />
          <StackScreen name={'MAIN'} component={MainNavigator} />
        </StackNavigator>
        {isSpinnerLoading ? <Spinner /> : null}
      </NavigationContainer>
    </>
  );
};

export default App;
