import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { deviceWidth } from '../../utils/device';
import { FPT_ORANGE_COLOR, INPUT_GRAY_COLOR, WHITE } from '@app/constants';
import { CalendarIcon, ChevronLeftIcon } from 'react-native-heroicons/outline';
import {
  setGlobalDateEnd,
  setGlobalDateStart,
} from '../../redux/features/room-booking/slice';
import { useAppNavigation } from '../../hooks/use-app-navigation.hook';
import { useAppSelector } from '../../hooks/use-app-selector.hook';
import { useAppDispatch } from '../../hooks/use-app-dispatch.hook';
import { useNavigationState } from '@react-navigation/native';
import dayjs from 'dayjs';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CalendarDateSelectProps {}

const CalendarDateSelect: React.FC<CalendarDateSelectProps> = (props) => {
  const dispatch = useAppDispatch();
  const navigate = useAppNavigation();
  const navigationState = useNavigationState(
    (state) => state.routes[state.routes.length - 1]
  ) as any;

  const { globalDateStart, globalDateEnd } = useAppSelector(
    (state) => state.roomBooking
  );

  const handleSetGlobalStartDate = (date) => {
    if (dayjs(date).diff(dayjs(globalDateEnd)) <= 0) {
      dispatch(setGlobalDateStart(date));
    } else {
      alert('Start date must not be larger than end date. Please try again');
    }
  };

  const handleSetGlobalEndDate = (date) => {
    if (dayjs(date).diff(dayjs(globalDateStart)) >= 0) {
      dispatch(setGlobalDateEnd(date));
    } else {
      alert('End date must not be smaller than start date. Please try again');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: WHITE }}>
      <View style={styles.container}>
        <Calendar
          markedDates={{
            [navigationState.params.type === 'dateStart'
              ? globalDateStart
              : globalDateEnd]: {
              selected: true,
              selectedColor: FPT_ORANGE_COLOR,
            },
          }}
          current={
            navigationState.params.type === 'dateStart'
              ? globalDateStart
              : globalDateEnd
          }
          onDayPress={(e) =>
            navigationState.params.type === 'dateStart'
              ? handleSetGlobalStartDate(e.dateString)
              : handleSetGlobalEndDate(e.dateString)
          }
        />
        <View
          style={{
            borderTopColor: INPUT_GRAY_COLOR,
            borderTopWidth: 1,
            height: 80,
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            backgroundColor: WHITE,
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            onPress={() => navigate.pop()}
            style={{
              height: 50,
              width: deviceWidth / 2.3,
              backgroundColor: WHITE,
              borderColor: FPT_ORANGE_COLOR,
              borderWidth: 2,
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <ChevronLeftIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 14} />
            <Text
              style={{
                color: FPT_ORANGE_COLOR,
                fontSize: deviceWidth / 21,
                fontWeight: '600',
              }}
            >
              Go Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate.pop()}
            style={{
              height: 50,
              width: deviceWidth / 2.3,
              backgroundColor: FPT_ORANGE_COLOR,
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Text
              style={{
                color: WHITE,
                fontSize: deviceWidth / 21,
                fontWeight: '600',
              }}
            >
              Select Date
            </Text>
            <CalendarIcon color={WHITE} size={deviceWidth / 14} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default CalendarDateSelect;
