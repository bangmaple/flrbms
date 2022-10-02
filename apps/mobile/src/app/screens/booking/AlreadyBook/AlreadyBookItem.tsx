import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deviceWidth } from '../../../utils/device';
import { BLACK, BLUE, FPT_ORANGE_COLOR, GREEN, WHITE } from '@app/constants';
import {
  InformationCircleIcon,
  LibraryIcon,
} from 'react-native-heroicons/outline';
import { CurrentBookingRoom } from '../../../redux/models/current-booking-room.model';
import dayjs from 'dayjs';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import { fetchCurrentRoomBookingDetail } from '../../../redux/features/room-booking/thunk/fetch-current-booking-detail.thunk';

interface AlreadyBookItemProps {
  item: CurrentBookingRoom;
}

const AlreadyBookItem: React.FC<AlreadyBookItemProps> = (props) => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  const handleViewAlreadyBookingDetail = (id: string) => {
    dispatch(fetchCurrentRoomBookingDetail(id))
      .unwrap()
      .then((e) => {
        navigate.navigate('ROOM_BOOKING_ALREADY_BOOKED_DETAIL');
      });
  };

  const getRoomBookingColorChip = useCallback(() => {
    if (props.item.status === 'BOOKING') {
      return {
        backgroundColor: BLUE,
      };
    } else if (props.item.status === 'CHECKED_IN') {
      return {
        backgroundColor: FPT_ORANGE_COLOR,
      };
    }
  }, [props.item.status]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {props.item.status === 'BOOKING'
            ? 'Room is booking'
            : `Room ${props.item.roomName}`}
        </Text>

        <View style={[styles.chipContainer, getRoomBookingColorChip()]}>
          <Text style={[styles.chipTextContent]}>{props.item.status}</Text>
        </View>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.iconContainer}>
          <LibraryIcon color={FPT_ORANGE_COLOR} />
        </View>
        <View style={styles.roomBookingInfo}>
          {props.item.status === 'BOOKING' ? (
            <Text style={{ color: BLACK, fontWeight: '500' }}>
              Requested at:{' '}
              {dayjs(props.item.requestedAt).format('HH:mm:ss DD/MM/YYYY')}
            </Text>
          ) : null}
          {props.item.status !== 'BOOKING' ? (
            <Text style={{ color: BLACK, fontWeight: '500' }}>
              Booked at:{' '}
              {dayjs(props.item.bookedAt).format('HH:mm:ss DD/MM/YYYY')}
            </Text>
          ) : null}
          {props.item.status === 'BOOKED' ? (
            <>
              <Text style={{ color: BLACK, fontWeight: '500' }}>
                Checkin at:{' '}
                {dayjs(props.item.timeCheckIn).format('HH:mm:ss DD/MM/YYYY')}
              </Text>
              <Text style={{ color: BLACK, fontWeight: '500' }}>
                Checkout at:{' '}
                {dayjs(props.item.timeCheckOut).format('HH:mm:ss DD/MM/YYYY')}
              </Text>
            </>
          ) : null}
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          marginRight: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => handleViewAlreadyBookingDetail(props.item.id)}
          style={{
            height: 30,
            width: deviceWidth / 3.9,
            borderRadius: 8,
            backgroundColor: FPT_ORANGE_COLOR,
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <InformationCircleIcon color={WHITE} size={deviceWidth / 18} />
          <Text style={{ fontWeight: '600', color: WHITE }}>View detail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    height: 140,
    width: deviceWidth / 1.05,
    backgroundColor: WHITE,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  headerTitle: {
    color: BLACK,
    fontSize: deviceWidth / 23,
    fontWeight: '600',
  },
  chipContainer: {
    height: 30,
    width: 100,
    backgroundColor: GREEN,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipTextContent: {
    color: WHITE,
    fontWeight: '600',
    fontSize: deviceWidth / 25,
  },
  bodyContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  roomBookingInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
});

export default AlreadyBookItem;
