import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { deviceHeight, deviceWidth } from '../../../utils/device';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'react-native-heroicons/outline';
import {
  saveEndDay,
  saveStartDay,
} from '../../../redux/features/room-booking/slice';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';
import dayjs from 'dayjs';
import { GenericAlertModal } from './generic-alert-modal.component';
import { fetchHolidays } from '../../../redux/features/holidays/thunk/fetch-holidays.thunk';
import isBetween from 'dayjs/plugin/isBetween';
const EndDayCalendar: React.FC<any> = (props) => {
  const Today = new Date().toJSON().slice(0, 10);
  const [dayEnd, setDayEnd] = useState<string>('');
  const currentDate = new Date().toJSON().slice(0, 10);
  const dispatch = useAppDispatch();
  const fromDay = useAppSelector(
    (state) => state.roomBooking.addRoomBooking.fromDay
  );

  const holidays = useAppSelector((state) => state.holidays.holidays);

  const [message, setMessage] = useState<string>();
  const [isShown, setShown] = useState<boolean>(false);

  const toDay = useAppSelector(
    (state) => state.roomBooking.addRoomBooking.toDay
  );
  const isMultiDate = useAppSelector(
    (state) => state.roomBooking.addRoomBooking.isMultiDate
  );

  useEffect(() => {
    dispatch(fetchHolidays());
  }, []);
  const handleDayPress = (day) => {
    let flag = true;
    let hName;
    let hStart;
    let hEnd;

    holidays.forEach((holiday) => {
      const providedDay = dayjs(day.dateString);
      const startDay = dayjs(holiday.start);
      const endDay = dayjs(holiday.end);
      dayjs.extend(isBetween);
      // @ts-ignore
      if (
        providedDay.isBetween(startDay, endDay) ||
        providedDay.isSame(startDay) ||
        providedDay.isSame(endDay)
      ) {
        flag = false;
        hName = holiday.name;
        hStart = startDay.format('MM/DD/YYYY');
        hEnd = endDay.format('MM/DD/YYYY');
      }

      // @ts-ignore
      if (flag === false) {
        setTimeout(() => {
          setMessage(
            'The day you are choosing is violated with the holiday: ' +
              hName +
              '. From: ' +
              hStart +
              '. To: ' +
              hEnd
          );
          setShown(true);
        }, 10);
      }
    });

    if (flag === true) {
      setDayEnd(day.dateString);
      dispatch(saveEndDay({ toDay: day.dateString }));
    }
  };

  const lastDay2Week = dayjs()
    .startOf('week')
    .add(21, 'day')
    .format('YYYY-MM-DD');

  return (
    <SafeAreaView style={styles.container}>
      <GenericAlertModal
        isShown={isShown}
        toggleShown={() => {
          setShown(!isShown);
          props.navigation.pop();
        }}
        message={message}
      />
      <View style={styles.container}>
        <Calendar
          minDate={fromDay || Today}
          maxDate={lastDay2Week}
          initialDate={fromDay || currentDate}
          onDayPress={(day) => handleDayPress(day)}
          markedDates={{
            [dayEnd]: {
              marked: true,
              selected: true,
              selectedColor: FPT_ORANGE_COLOR,
            },
          }}
          renderArrow={(direction) => (
            <View>
              {direction === 'left' ? (
                <View style={styles.selectDateChevronLeftButton}>
                  <ChevronLeftIcon color={FPT_ORANGE_COLOR} />
                </View>
              ) : (
                <View style={styles.selectDateChevronRightButton}>
                  <ChevronRightIcon color={FPT_ORANGE_COLOR} />
                </View>
              )}
            </View>
          )}
          style={{
            width: deviceWidth,
          }}
          theme={{
            indicatorColor: FPT_ORANGE_COLOR,
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 16,
          }}
        />
        <View />
        <TouchableOpacity
          style={styles.bookingNowContainer}
          onPress={() => {
            props.navigation.navigate('ROOM_BOOKING_LATER', { dayEnd });
          }}
        >
          <Text style={styles.bookingNowButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 20,
    backgroundColor: WHITE,
  },
  selectDateChevronLeftButton: {
    width: deviceWidth / 11,
    height: deviceWidth / 11,
    borderRadius: 8,
    borderColor: FPT_ORANGE_COLOR,
    borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectDateChevronRightButton: {
    width: deviceWidth / 11,
    height: deviceWidth / 11,
    borderRadius: 8,
    borderColor: FPT_ORANGE_COLOR,
    borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingNowContainer: {
    width: deviceWidth / 1.05,
    height: deviceHeight / 13,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: WHITE,
    fontSize: 20,
    fontWeight: '600',
    borderRadius: 10,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: FPT_ORANGE_COLOR,
    alignSelf: 'center',
  },
  bookingNowButtonText: {
    fontSize: deviceWidth / 21,
    color: WHITE,
    fontWeight: '600',
  },
});
export default EndDayCalendar;
