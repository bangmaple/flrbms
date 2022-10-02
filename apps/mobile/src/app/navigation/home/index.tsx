import React from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigator, StackScreen } from '@app/utils';
import { useAppDispatch } from '../../hooks/use-app-dispatch.hook';
import { useAppNavigation } from '../../hooks/use-app-navigation.hook';
import RoomBookingNavigator from '../room-booking';
import TrackBookingRoomNavigator from './track-booking-room';
import RoomBookingCheckoutNavigator from '../room-booking/checkout';
import HomeScreen from '../../screens/home';
import QuickAccessControlScreen from '../../screens/home/section/quick-access-control';
import RoomBookingWishlistNavigator from '../room-booking/room-booking-wishlist.navigator';
import NotificationNavigator from './notification';
import CheckinBookingRoomNavigator from './check-in-booking-room';
import TrackFeedbackNavigator from './track-feedback';
import TrackRoomBookingFeedbackNavigator from './track-room-booking-feedback';
import NoRoomBookingCheckOut from '../../screens/booking/checkout/no-room-booking';
import CheckinBookingRoomNotFound from '../../screens/booking/check-in-booking-room/not-found';

const HomeNavigator: React.FC = () => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  return (
    <StackNavigator initialRouteName={'HOME_SCREEN'}>
      <StackScreen
        name={'HOME_SCREEN'}
        options={{
          headerShown: false,
        }}
        component={HomeScreen}
      />
      <StackScreen
        name="QUICK_ACCESS_CONTROL"
        component={QuickAccessControlScreen}
        options={{
          headerTitle: 'Quick Access Control',
        }}
      />
      <StackScreen
        name={'ROOM_BOOKING'}
        options={{
          headerShown: false,
        }}
        component={RoomBookingNavigator}
      />
      <StackScreen
        name={'ROOM_CHECKOUT'}
        options={{
          headerShown: false,
        }}
        component={RoomBookingCheckoutNavigator}
      />
      <StackScreen name="NO_ROOM_CHECKOUT" component={NoRoomBookingCheckOut} />
      <StackScreen
        name="CHECK_IN_NOT_FOUND"
        options={{
          headerShown: false,
        }}
        component={CheckinBookingRoomNotFound}
      />
      <StackScreen
        name="TRACK_BOOKING_ROOM"
        options={{
          headerShown: false,
        }}
        component={TrackBookingRoomNavigator}
      />
      <StackScreen
        name="TRACK_FEEDBACK"
        options={{
          headerShown: false,
        }}
        component={TrackFeedbackNavigator}
      />
      <StackScreen
        name="BOOKING_ROOM_WISHLIST"
        component={RoomBookingWishlistNavigator}
        options={{
          headerShown: false,
        }}
      />
      <StackScreen
        options={{
          headerShown: false,
        }}
        name="TRACK_ROOM_BOOKING_FEEDBACK"
        component={TrackRoomBookingFeedbackNavigator}
      />
      <StackScreen name="NOTIFICATION" component={NotificationNavigator} />
      <StackScreen
        options={{
          headerShown: false,
        }}
        name="CHECK_IN"
        component={CheckinBookingRoomNavigator}
      />
    </StackNavigator>
  );
};

const styles = StyleSheet.create({});

export default HomeNavigator;
