import React from 'react';
import { useAppNavigation } from '../../../../hooks/use-app-navigation.hook';
import { useAppDispatch } from '../../../../hooks/use-app-dispatch.hook';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { deviceHeight, deviceWidth } from '../../../../utils/device';
import { BLACK, WHITE } from '@app/constants';
import {
  CalendarIcon,
  ClockIcon,
  HomeIcon,
} from 'react-native-heroicons/outline';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';
import { step1ScheduleRoomBooking } from '../../../../redux/features/room-booking/slice';

const RequestRoomBookingRecentlySearch: React.FC<any> = () => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();
  const user = LOCAL_STORAGE.getString('user');
  const historySearch = user
    ? LOCAL_STORAGE.getString(JSON.parse(user).username)
    : undefined;

  let historyArray = [];
  if (typeof historySearch !== 'undefined') {
    historyArray = new Function('return [' + historySearch + '];')();
  }

  const handleBookAgain = (props) => {
    dispatch(
      step1ScheduleRoomBooking({
        roomId: props.roomId,
        roomName: props.roomName,
        fromDay: props.fromDay,
        fromSlot: props.slotId,
        toSlot: props.slotId,
      })
    );
    setTimeout(() => {
      navigate.navigate('ROOM_BOOKING_2');
    }, 0);
  };

  const RecentlyHistory = (props, index) => {
    return (
      <TouchableOpacity onPress={() => handleBookAgain(props)} key={index}>
        <View style={styles.itemContainer}>
          <View style={styles.itemWrapper}>
            <HomeIcon color={BLACK} size={deviceWidth / 16} />
            <Text style={styles.textContent}>{props.roomName}</Text>
          </View>
          <View style={styles.rowContent}>
            <CalendarIcon color={BLACK} size={deviceWidth / 16} />
            <Text style={styles.textContent}>{props.fromDay}</Text>
          </View>
          <View style={styles.rowContent}>
            <ClockIcon color={BLACK} size={deviceWidth / 16} />
            <Text style={styles.textContent}>{props.slotName || 'N/A'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!historySearch) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Recently search</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {typeof historySearch !== 'undefined'
          ? historyArray.map((history, index) => {
              return RecentlyHistory(history, index);
            })
          : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginLeft: 6,
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: deviceWidth / 20,
    marginLeft: 10,
  },
  itemContainer: {
    borderRadius: 8,
    display: 'flex',
    marginLeft: 10,
    marginBottom: 10,
    marginRight: Platform.OS === 'android' ? 10 : 0,

    height: deviceHeight / 7.8,
    width: deviceWidth / 2,
    backgroundColor: WHITE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    marginTop: 10,
    elevation: 7,
  },
  textContent: {
    fontWeight: '600',
    marginLeft: 6,
  },
  rowContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 6,
  },
  itemWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 6,
  },
});

export default RequestRoomBookingRecentlySearch;
