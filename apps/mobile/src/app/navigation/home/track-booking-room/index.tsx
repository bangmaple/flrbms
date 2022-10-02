import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigator, StackScreen } from '@app/utils';
import AcceptBookingNavigator from './accept-booking';
import TrackBookingRoom from '../../../screens/track-booking-room';
import CalendarDateSelect from '../../../screens/track-booking-room/calendar-select';
import { QrcodeIcon } from 'react-native-heroicons/outline';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { deviceWidth } from '../../../utils/device';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import BookingQRScan from '../../../screens/track-booking-room/booking-qr-scan';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';

const TrackBookingRoomNavigator: React.FC<any> = () => {
  const navigate = useAppNavigation();
  const user = useAppSelector((state) => state.user);
  return (
    <StackNavigator
      initialRouteName="TRACK_BOOKING"
      screenOptions={{
        title: 'Booking Requests',
        headerRight: () =>
          user.role !== 'Staff' ? (
            <TouchableOpacity
              onPress={() => navigate.navigate('BOOKING_QR_SCAN')}
              style={{
                height: 35,
                width: 35,
                borderRadius: 8,
                borderColor: FPT_ORANGE_COLOR,
                borderWidth: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QrcodeIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 14} />
            </TouchableOpacity>
          ) : null,
      }}
    >
      <StackScreen name="TRACK_BOOKING" component={TrackBookingRoom} />
      <StackScreen
        options={{
          headerShown: false,
        }}
        name="ACCEPT_ROOM_BOOKING"
        component={AcceptBookingNavigator}
      />
      <StackScreen name="BOOKING_QR_SCAN" component={BookingQRScan} />
      <StackScreen
        name="CALENDAR_SELECT"
        options={{
          headerShown: false,
        }}
        component={CalendarDateSelect}
      />
    </StackNavigator>
  );
};

const styles = StyleSheet.create({});

export default TrackBookingRoomNavigator;
