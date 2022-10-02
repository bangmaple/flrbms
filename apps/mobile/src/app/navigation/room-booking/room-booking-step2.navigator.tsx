import React from 'react';

import { StackNavigator, StackScreen } from '@app/utils';
import { StyleSheet, Text } from 'react-native';
import { BLACK } from '@app/constants';
import RoomBooking2 from '../../screens/booking/room-booking-2';

const RoomBookingStep2: React.FC<any> = () => {
  return (
    <StackNavigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'BOOKING_ROOM_STEP2'}
    >
      <StackScreen name={'BOOKING_ROOM_STEP2'} component={RoomBooking2} />
    </StackNavigator>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: BLACK,
    fontSize: 20,
    fontWeight: '600',
  },
});

export default RoomBookingStep2;
