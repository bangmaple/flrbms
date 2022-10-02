import React from 'react';
import { StackNavigator, StackScreen } from '@app/utils';
import AcceptBooking from '../../../../screens/track-booking-room/accept-booking';
import ListDevice from '../../../../screens/track-booking-room/accept-booking/list-device';
import SuccessfullyAcceptedBookingRequest from '../../../../screens/track-booking-room/accept-booking/success-accepted-booking-request';

const AcceptBookingNavigator: React.FC<any> = () => {
  return (
    <StackNavigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="ACCEPT_BOOKING"
    >
      <StackScreen name="ACCEPT_BOOKING" component={AcceptBooking} />
      <StackScreen name="ACCEPT_BOOKING_LIST_DEVICES" component={ListDevice} />
      <StackScreen
        name="SUCCESSFULLY_ACCEPTED_BOOKING_REQUEST"
        component={SuccessfullyAcceptedBookingRequest}
      />
    </StackNavigator>
  );
};

export default AcceptBookingNavigator;
