import React from 'react';
import { StyleSheet } from 'react-native';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import { StackNavigator, StackScreen } from '@app/utils';
import NoRoomBookingCheckOut from '../../../screens/booking/checkout/no-room-booking';
import RoomCheckout1 from '../../../screens/booking/room-checkout-1';
import RoomInBookingDetailNavigator from '../../home/booking-room-booking-detail.navigator';
import ReadyToCheckout from '../../../screens/booking/checkout/ready-to-checkout';
import CheckoutSuccessfully from '../../../screens/booking/checkout/checkout-successful';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';

const RoomBookingCheckoutNavigator: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const navigate = useAppNavigation();

  const { roomBookingCheckout } = useAppSelector((state) => state.roomBooking);

  return (
    <StackNavigator
      initialRouteName={
        roomBookingCheckout.id ? 'READY_CHECKOUT' : 'NO_ROOM_CHECKOUT'
      }
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackScreen name={'ROOM_CHECKOUT_1'} component={RoomCheckout1} />
      <StackScreen
        name={'ROOM_INBOOKING_DETAIL'}
        component={RoomInBookingDetailNavigator}
      />
      <StackScreen name="NO_ROOM_CHECKOUT" component={NoRoomBookingCheckOut} />
      <StackScreen
        name="READY_CHECKOUT"
        component={ReadyToCheckout}
        options={{
          headerShown: true,
          headerTitle: 'Are you ready to checkout?',
        }}
      />
      <StackScreen
        name="CHECKOUT_SUCCESSFULLY"
        component={CheckoutSuccessfully}
      />
    </StackNavigator>
  );
};

const styles = StyleSheet.create({});

export default RoomBookingCheckoutNavigator;
