import { StackNavigator, StackScreen } from '@app/utils';
import { StyleSheet, Text } from 'react-native';
import { BLACK } from '@app/constants';
import RoomBookingWishlist from '../../screens/booking/room-booking-wishlist';
import React from 'react';
import ChooseDayWishlist from '../../screens/booking/request-room-booking/choose-day-wishlist';

const RoomBookingWishlistNavigator = () => {
  return (
    <StackNavigator
      screenOptions={{
        headerTitle: () => (
          <Text style={styles.headerText}>Booking Wishlist</Text>
        ),
        headerRight: () => null,
      }}
      initialRouteName={'BOOKING_WISHLIST'}
    >
      <StackScreen name={'BOOKING_WISHLIST'} component={RoomBookingWishlist} />
      <StackScreen
        name={'BOOKING_WISHLIST_CHOOSE_DAY'}
        component={ChooseDayWishlist}
      />
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

export default RoomBookingWishlistNavigator;
