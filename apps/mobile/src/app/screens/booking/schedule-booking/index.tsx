import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
} from 'react-native-heroicons/outline';
import Asterik from '../../../components/text/asterik';
import { deviceHeight, deviceWidth } from '../../../utils/device';
import { BLACK, FPT_ORANGE_COLOR, GRAY, WHITE } from '@app/constants';
import { getTimeDetailBySlotNumber } from '../../../utils/slot-resolver.util';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import dayjs from 'dayjs';
import AlertModal from '../../../components/modals/alert-modal.component';
import { step1ScheduleRoomBooking } from '../../../redux/features/room-booking/slice';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import CustomSlotBookingModal from './custom-slot-booking';
import Footer from './footer';
import { fetchAllSlots } from '../../../redux/features/slot';
import SelectDuration from './select-duration';
import { Slot } from '../../../redux/models/slot.model';

const ScheduleRoomBooking: React.FC = () => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  const [isErrorModalShown, setErrorModalShown] = useState<boolean>(false);
  const [isSlotSelected, setSlotSelected] = useState<boolean>(false);
  const [slotStart, setSlotStart] = useState<string>();
  const [slotEnd, setSlotEnd] = useState<string>();
  const [currentSelectedDate, setCurrentSelectedDate] =
    useState<string>('2022-05-01');

  const [isCustomSlotModalShown, setCustomSlotModalShown] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [slotSelections, setSlotSelections] = useState([]);

  useEffect(() => {
    dispatch(fetchAllSlots())
      .unwrap()
      .then((val) => transformSlotsToSlotPicker(val));
    return () => {
      setSlotSelections([]);
    };
  }, []);

  const transformSlotsToSlotPicker = (val: Slot[]) => {
    const slotSelections = val.map((slot, index) => {
      return {
        value: slot.id,
        label: slot.name,
      };
    });
    setSlotSelections(slotSelections);
    handleSetSlotStart(slotSelections[0].value);
    handleSetSlotEnd(slotSelections[0].value);
  };

  useEffect(() => {
    const dayOfWeek = dayjs(currentSelectedDate).day();
    if (dayOfWeek === 0) {
      const currentDateString = dayjs().toISOString().split('T')[0];
      setCurrentSelectedDate(currentDateString);
      setErrorMessage('Please select other day than Sunday');
      // setErrorModalShown(true);
    }
  }, [currentSelectedDate]);

  useEffect(() => {
    if (slotEnd < slotStart) {
      setSlotEnd(slotStart);
    }
    if (slotStart > slotEnd) {
      setSlotStart(slotEnd);
    }
  }, [slotStart, slotEnd]);

  const handleSetSlotEnd = (value) => {
    if (value === undefined || value === null) {
      setSlotEnd('1');
    } else {
      setSlotEnd(value);
    }
  };

  const handleSetSlotStart = (value) => {
    if (value === undefined || value === null) {
      setSlotStart('1');
    } else {
      setSlotStart(value);
    }
  };

  const handleResetCalendar = () => {
    setSlotStart('1');
    setSlotEnd('1');
    setCurrentSelectedDate('2022-05-01');
  };

  const handleNextStep = () => {
    const slotStartDetail = dayjs(
      `${currentSelectedDate} ${getTimeDetailBySlotNumber(1).startTime}`
    ).format(`YYYY-MM-DDTHH:mm:ss.SSS[Z]`);
    const slotEndDetail = dayjs(
      `${currentSelectedDate} ${getTimeDetailBySlotNumber(1).endTime}`
    ).format(`YYYY-MM-DDTHH:mm:ss.SSS[Z]`);
    dispatch(
      step1ScheduleRoomBooking({
        fromSlot: slotStartDetail,
        toSlot: slotEndDetail,
      })
    );
    setTimeout(() => {
      navigate.navigate('ROOM_BOOKING_CHOOSE_ROOM');
    }, 0);
  };

  const Body: React.FC = () => {
    return (
      <ScrollView style={{ height: deviceHeight / 1.5 }}>
        <View style={styles.selectDateContainer}>
          <Text style={styles.selectDateTitle}>Select a date</Text>
          <Calendar
            current={currentSelectedDate}
            minDate={'2022-05-17'}
            maxDate={'2022-09-31'}
            onDayLongPress={(e) => {
              setSelectedDate(e.dateString);
              setCustomSlotModalShown(true);
            }}
            onDayPress={(e) => setCurrentSelectedDate(e.dateString)}
            markedDates={{
              [currentSelectedDate]: {
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
          />
        </View>
        <SelectDuration
          handleSetSlotStart={(val) => setSlotStart(val)}
          handleSetSlotEnd={(val) => setSlotEnd(val)}
          slotStart={slotStart}
          slotEnd={slotEnd}
          slotSelections={slotSelections}
        />
        <View style={styles.noticeContainer}>
          <View style={styles.noticeTextContainer}>
            <Asterik />
            <Text style={styles.noticeText}>
              Room booking time might affect with the library operation time.
              Please book your room wisely!
            </Text>
          </View>
        </View>
        <CustomSlotBookingModal
          date={selectedDate}
          isShown={isCustomSlotModalShown}
          toggleShown={() => setCustomSlotModalShown(!isCustomSlotModalShown)}
        />
        <AlertModal
          isOpened={isErrorModalShown}
          height={deviceWidth / 2}
          width={deviceWidth / 1.5}
          toggleShown={() => setErrorModalShown(!isErrorModalShown)}
        >
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-around',
              flex: 1,
            }}
          >
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <ExclamationCircleIcon
                size={deviceWidth / 8}
                color={FPT_ORANGE_COLOR}
              />
              <Text
                style={{
                  color: BLACK,
                  fontWeight: '600',
                  fontSize: deviceWidth / 23,
                  textAlign: 'center',
                }}
              >
                {errorMessage}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setErrorModalShown(false)}
              style={{
                width: deviceWidth / 1.7,
                height: 40,
                backgroundColor: FPT_ORANGE_COLOR,
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: WHITE,
                  fontWeight: '600',
                  fontSize: deviceWidth / 23,
                }}
              >
                I understand
              </Text>
            </TouchableOpacity>
          </View>
        </AlertModal>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Body />
        <Footer
          handleNextStep={() => handleNextStep()}
          handleResetCalendar={() => handleResetCalendar()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  noticeText: {
    fontSize: 16,
  },
  noticeTextContainer: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  noticeContainer: {
    marginTop: 10,
    height: 60,
    backgroundColor: WHITE,
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  selectDateContainer: {
    backgroundColor: WHITE,
  },
  selectDateTitle: {
    margin: 10,
    color: GRAY,
    fontSize: 20,
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
});

export default ScheduleRoomBooking;
