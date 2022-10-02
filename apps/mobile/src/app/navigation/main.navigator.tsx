import React, {useEffect, useState} from 'react';

import {
  StackNavigator,
  StackScreen,
  TabNavigator,
  TabScreen,
} from '@app/utils';
import {
  HomeRoute,
  QRScanRoute,
  UserNavigatorRoute,
} from '../utils/screen.navigator.utils';
import { HomeIcon, UserIcon } from 'react-native-heroicons/solid';
import QRScan from '../screens/qr-scan.screen';
import QRScanButton from '../components/buttons/QRScanButton';
import { Platform } from 'react-native';
import HomeNavigator from './home';
import UserNavigator from './user';
import BookingQRScan from '../screens/track-booking-room/booking-qr-scan';
import AcceptBookingNavigator from './home/track-booking-room/accept-booking';
import { LOCAL_STORAGE } from '../utils/local-storage';
import {useAppSelector} from "../hooks/use-app-selector.hook";
import {NotificationModal} from "../components/notification-modal.component";


const MainNavigator = () => {
  const [isNotificationShown, setNotificationShown] = useState(true);
  return (
    <>

      <StackNavigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={'INITIAL'}
      >
        <StackScreen name={'INITIAL'} component={HomeTabs} />
        <StackScreen
          name="QR_ACCEPT_BOOKING"
          component={AcceptBookingNavigator}
        />
        <StackScreen name={QRScanRoute.QRScan} component={QRScan} />
      </StackNavigator>
    </>

  );
};

const HomeTabs: React.FC = () => {
  const authUser = useAppSelector((state) => state.auth.authUser);
  return (
    <TabNavigator
      initialRouteName={HomeRoute.Home}
      screenOptions={{
        tabBarStyle: {
          height: Platform.OS === 'android' ? 80 : 70,
        },
        headerShown: false,
      }}
    >
      <TabScreen
        name={HomeRoute.Home}
        component={HomeNavigator}
        options={{
          tabBarIcon: () => <HomeIcon color="black" size={30} />,
          tabBarLabel: () => null,
        }}
      />
      {authUser.role !== 'Staff' ? (
        <TabScreen
          name={QRScanRoute.QRScan}
          component={BookingQRScan}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: () => <QRScanButton />,
          }}
        />
      ) : null}

      <TabScreen
        name={UserNavigatorRoute}
        component={UserNavigator}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => <UserIcon color="black" size={30} />,
        }}
      />
    </TabNavigator>
  );
};

export default MainNavigator;
