import React from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigator, StackScreen } from '@app/utils';
import CheckinBookingRoomNotFound from '../../../screens/booking/check-in-booking-room/not-found';
import RoomBookingReadyToCheckIn from '../../../screens/booking/checkin/ready-to-checkin';
import ListDevice from '../../../screens/track-booking-room/accept-booking/list-device';

const CheckinBookingRoomNavigator: React.FC<any> = () => {
  return (
    <StackNavigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="READY_TO_CHECKIN"
    >
      <StackScreen
        name="READY_TO_CHECKIN"
        component={RoomBookingReadyToCheckIn}
      />
      <StackScreen
        name="CHECK_IN_NOT_FOUND"
        component={CheckinBookingRoomNotFound}
      />
      <StackScreen name="ACCEPT_BOOKING_LIST_DEVICES" component={ListDevice} />
    </StackNavigator>
  );
};

const styles = StyleSheet.create({});

export default CheckinBookingRoomNavigator;
