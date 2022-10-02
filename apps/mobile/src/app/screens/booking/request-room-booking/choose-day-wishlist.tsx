import React, { useState } from 'react';
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
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import { saveStartDay } from '../../../redux/features/room-booking/slice';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';

const ChooseDayWishList: React.FC<any> = (props) => {
  const dispatch = useAppDispatch();
  const [dayStart, setDayStart] = useState<string>('');
  const currentDate = new Date().toJSON().slice(0, 10);
  const today = useAppSelector((state) => state.roomBooking.today);
  const navigate = useAppNavigation();

  const handleDayPress = (day) => {
    setDayStart(day.dateString);
    dispatch(saveStartDay({ fromDay: day.dateString }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Calendar
          initialDate={currentDate}
          minDate={today}
          onDayPress={(day) => handleDayPress(day)}
          markedDates={{
            [dayStart]: {
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
            setTimeout(() => {
              navigate.navigate('ROOM_BOOKING_2');
            }, 0);
          }}
        >
          <Text style={styles.bookingNowButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export const styles = StyleSheet.create({
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
  },
  bookingNowButtonText: {
    fontSize: deviceWidth / 21,
    color: WHITE,
    fontWeight: '600',
  },
});
export default ChooseDayWishList;
