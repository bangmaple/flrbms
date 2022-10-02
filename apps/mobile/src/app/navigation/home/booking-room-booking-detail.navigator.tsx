import { StackNavigator, StackScreen } from '@app/utils';
import { Text } from 'react-native';
import { BLACK } from '@app/constants';
import React from 'react';
import RoomInBookingDetail from '../../screens/booking/room-inbooking-detail';

const RoomInBookingDetailNavigator = () => {
  return (
    <StackNavigator
      screenOptions={{
        headerTitle: () => (
          <Text
            style={{
              color: BLACK,
              fontSize: 20,
              fontWeight: '600',
            }}
          >
            Room Booking Detail
          </Text>
        ),
        headerRight: () => null,
      }}
      initialRouteName={'ROOM_INBOOKING_DETAIL'}
    >
      <StackScreen
        name={'ROOM_INBOOKING_DETAIL'}
        component={RoomInBookingDetail}
      />
    </StackNavigator>
  );
};

export default RoomInBookingDetailNavigator;
