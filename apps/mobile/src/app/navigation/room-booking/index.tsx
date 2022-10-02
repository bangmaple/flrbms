import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigator, StackScreen } from '@app/utils';
import { StatusBar, StyleSheet, Text, TouchableOpacity } from 'react-native';
import RoomBooking1 from '../../screens/booking/room-booking-1';
import { HeartIcon, XIcon } from 'react-native-heroicons/outline';
import RoomBookingNow from '../../screens/booking/room-booking-now';
import { BLACK, PINK } from '@app/constants';
import { RoomBooking3 } from '../../screens/booking/room-booking-3';
import { RoomBookingSuccess } from '../../screens/booking/room-booking-success';
import { RoomBookingFail } from '../../screens/booking/room-booking-fail';
import RoomBookingStep2 from './room-booking-step2.navigator';
import RoomBookingWishlistNavigator from './room-booking-wishlist.navigator';
import RoomBookingChooseRoom from '../../screens/booking/room-booking-choose-room';
import ChooseRoomItemDetail from '../../screens/booking/ChooseRoom/choose-room-item-detail';
import AlreadyBookDetail from '../../screens/booking/AlreadyBook/Detail';
import RoomBookingAlreadyBook from '../../screens/booking/checkin/room-booking-already-book';
import ScheduleRoomBookingLater from '../../screens/booking/request-room-booking';
import StartDayCalendar from '../../screens/booking/request-room-booking/choose-start-day';
import EndDayCalendar from '../../screens/booking/request-room-booking/choose-end-day';
import RoomBookingChooseSlotScreen from '../../screens/booking/request-room-booking/room-booking-choose-slot-screen';
import ChooseRoomLongTermBooking from '../../screens/booking/request-room-booking/choose-room-long-term-booking';

const RoomBookingNavigator: React.FC = () => {
  const navigate = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <>
      <StatusBar hidden />
      <StackNavigator
        initialRouteName={'ROOM_BOOKING_LATER'}
        screenOptions={{
          headerTitle: () => (
            <Text style={styles.headerText}>Request for Room Booking</Text>
          ),
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate.pop()}>
              <XIcon color="#808080" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigate.navigate('ROOM_BOOKING_WISHLIST')}
            >
              <HeartIcon color={PINK} />
            </TouchableOpacity>
          ),
        }}
      >
        <StackScreen
          name={'ROOM_BOOKING_ALREADY_BOOKED'}
          options={{
            headerTitle: '',
          }}
          component={RoomBookingAlreadyBook}
        />
        <StackScreen
          name={'ROOM_BOOKING_1'}
          options={{}}
          component={RoomBooking1}
        />
        <StackScreen
          name={'ROOM_BOOKING_2'}
          options={{
            headerShown: false,
          }}
          component={RoomBookingStep2}
        />
        <StackScreen
          name={'ROOM_BOOKING_3'}
          options={{
            headerShown: false,
          }}
          component={RoomBooking3}
        />
        <StackScreen
          name={'ROOM_BOOKING_SUCCESS'}
          options={{
            headerShown: false,
          }}
          component={RoomBookingSuccess}
        />
        <StackScreen
          name={'ROOM_BOOKING_FAIL'}
          options={{
            headerShown: false,
          }}
          component={RoomBookingFail}
        />
        <StackScreen name={'ROOM_BOOKING_NOW'} component={RoomBookingNow} />
        <StackScreen
          options={{
            headerShown: false,
          }}
          name={'ROOM_BOOKING_LATER'}
          component={ScheduleRoomBookingLater}
        />
        <StackScreen
          name="ROOM_BOOKING_CHOOSE_ROOM"
          component={RoomBookingChooseRoom}
        />
        <StackScreen
          name="ROOM_BOOKING_VIEW_ROOM_DETAIL"
          component={ChooseRoomItemDetail}
        />
        <StackScreen
          name="ROOM_BOOKING_ALREADY_BOOKED_DETAIL"
          component={AlreadyBookDetail}
        />
        <StackScreen
          options={{
            headerShown: false,
          }}
          name="ROOM_BOOKING_CHOOSE_START_DAY"
          component={StartDayCalendar}
        />
        <StackScreen
          options={{
            headerShown: false,
          }}
          name="ROOM_BOOKING_CHOOSE_END_DAY"
          component={EndDayCalendar}
        />
        <StackScreen
          name={'ROOM_BOOKING_WISHLIST'}
          options={{
            headerShown: false,
          }}
          component={RoomBookingWishlistNavigator}
        />
        <StackScreen
          options={{
            headerShown: false,
          }}
          name="ROOM_BOOKING_CHOOSE_SLOT"
          component={RoomBookingChooseSlotScreen}
        />
        <StackScreen
          name="ROOM_BOOKING_LONG_TERM_CHOOSE_ROOM"
          component={ChooseRoomLongTermBooking}
        />
      </StackNavigator>
    </>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: BLACK,
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default RoomBookingNavigator;
