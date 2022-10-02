import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BLACK,
  FPT_ORANGE_COLOR,
  GRAY,
  INPUT_GRAY_COLOR,
  WHITE,
} from '@app/constants';
import { deviceHeight, deviceWidth } from '../../../utils/device';
import {
  DeviceTabletIcon,
  DocumentAddIcon,
  TicketIcon,
  TrashIcon,
} from 'react-native-heroicons/outline';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import {fetchAllSlots, fetchSlots} from '../../../redux/features/slot';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import {
  saveMultiDate,
} from '../../../redux/features/room-booking/slice';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';
import DateSelect from './date-select';
import RequestRoomBookingHeader from './header';
import { fetchCountRequestInWeekOfUser } from '../../../redux/features/room-booking/thunk/fetch-count-request-in-week-of-user.thunk';
import dayjs from 'dayjs';
import RequestRoomBookingCapacitySelect from './capacity-select';
import RequestRoomBookingTimeSelect from './time-select';
import {
  updateAutoBookingRequest,
} from '../../../redux/features/room-booking-v2/slice';
import {GenericAlertModal} from "./generic-alert-modal.component";
import BookingRequestItem from "./booking-request-item";
import {isCheckInDateTimeIsBeforeCurrentDateTime, isDateRangeOverlapWithAnother} from "./room-booking-date.service";
import {fetchCurrentDatetime} from "../../../redux/features/room-booking-v2/thunk/fetch-current-datetime.thunk";
import RoomBookingDeviceSelect from "./device-select";

const ScheduleRoomBookingLater: React.FC<any> = () => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();


  const [slotSelections, setSlotSelections] = useState([]);

  const [isMultiDateChecked, setMultiDateChecked] = useState<boolean>(false);
  const [isMultiSlotChecked, setMultiSlotChecked] = useState<boolean>(false);

  const [canBook, setCanBook] = useState<boolean>(true);

  const [checkInAt, setCheckInAt] = useState(dayjs().format('HH:mm'));
  const [checkOutAt, setCheckOutAt] = useState(dayjs().format('HH:mm'));
  const [capacity, setCapacity] = useState(10);

  const [fromDay, setFromDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [toDay, setToDay] = useState<string>(dayjs().format('YYYY-MM-DD'));


  const slots = useAppSelector((state) => state.slot.newSlots);


  useEffect(() => {
    dispatch(fetchCurrentDatetime()).unwrap()
      .then(({date}) => {
        const day = dayjs(date, {
          format: 'YYYY-MM-DD HH:mm:ss'
        });
        setFromDay(day.format('YYYY-MM-DD'));
        setToDay(day.format('YYYY-MM-DD'))
        setCheckInAt(day.format('HH:mm'));
        setCheckOutAt(day.format('HH:mm'));
      })
    dispatch(fetchSlots());
    return () => {
      setSlotSelections([]);
    };
  }, []);

  const [startingTime, setStartingTime] = useState();
  const [endingTime, setEndingTime] = useState();

  const [isDeviceSelectShown, setDeviceSelectShown] = useState(false);

  useEffect(() => {
    const size = Object.keys(slots).length;
    const obj = Object.keys(slots);
    obj.map((o, i) => {
      if (i === 0) {
        setStartingTime(slots[o].start);
      } else if (size - 1 === i) {
        setEndingTime(slots[o].end);
      }
    })
  }, [slots]);



  useEffect(() => {
    dispatch(fetchCountRequestInWeekOfUser())
      .unwrap()
      .then((val) => setCanBook(val.isAvailable));
  }, []);


  const getContainerHeightBasedOnMultiChecks = () => {
    if (!isMultiDateChecked && !isMultiSlotChecked) {
      return {
        height: Platform.OS === 'android' ? deviceHeight / 2.2 : 340,
      };
    } else if (isMultiDateChecked && isMultiSlotChecked) {
      return {
        height: Platform.OS === 'android' ? deviceHeight / 1.3 : 490,
      };
    } else if (isMultiDateChecked || isMultiSlotChecked) {
      return {
        height: Platform.OS === 'android' ? deviceHeight / 1.75 : 350,
      };
    }
  };
  const [genericMessage, setGenericMessage] = useState<string>();
  const [isGenericModalShown, setGenericModalShown] = useState<boolean>(false);

  const handleSetCheckInAt = (val: string) => {
    const providedCheckInAt = dayjs(`${fromDay} ${val}`);
    const currentStartingTime = dayjs(`${fromDay} ${startingTime}`);
    const currentEndingTime = dayjs(`${fromDay} ${endingTime}`);
    const currentCheckOutAt = dayjs(`${fromDay} ${checkOutAt}`);
    if (providedCheckInAt.isAfter(currentCheckOutAt)) {
      setGenericModalShown(true);
      return setGenericMessage("The provided check-in time should not be after the current check-out time. Please try again");
    }

    if (providedCheckInAt.isSame(currentEndingTime) || providedCheckInAt.isAfter(currentEndingTime)) {
      setGenericModalShown(true);
      return setGenericMessage("The provided check-in time should not be after or the same as then ending slot. Please try again");
    }
    if (providedCheckInAt.isBefore(currentStartingTime)) {
      setGenericModalShown(true);
      return setGenericMessage("The provided check-in time should be before or the same as the starting slot time. Please try again");
    } else {
      setCheckInAt(val);
    }
  }

  const handleSetCheckOutAt = (val: string) => {
    const providedCheckOutAt = dayjs(`${dayjs().format("YYYY-DD-MM")} ${val}`);
    const currentStartingTime = dayjs(`${dayjs().format("YYYY-DD-MM")} ${startingTime}`);
    const currentEndingTime = dayjs(`${dayjs().format("YYYY-DD-MM")} ${endingTime}`);
    const currentCheckInAt = dayjs(`${dayjs().format("YYYY-DD-MM")} ${checkInAt}`);
    if (providedCheckOutAt.isBefore(currentCheckInAt)) {
      setGenericModalShown(true);
      return setGenericMessage("The provided check-out time should not be before the current check-in time. Please try again");
    }
    if (providedCheckOutAt.isSame(currentStartingTime) || providedCheckOutAt.isBefore(currentStartingTime)) {
      setGenericModalShown(true);
      return setGenericMessage("The provided check-out time should not be the same or before the ending slot time. Please try again");
    }
    if (providedCheckOutAt.isAfter(currentEndingTime) || providedCheckOutAt.isSame(currentEndingTime)) {
      setGenericModalShown(true);
      return setGenericMessage("The provided check-out time should be before the ending slot time. Please try again");
    } else {
      setCheckOutAt(val);
    }
  }

  useEffect(() => {
    if (!isMultiDateChecked) {
      setToDay(fromDay);
    }
  }, [isMultiDateChecked])

  const [bookingRequests, setBookingRequests] = useState<
    {
      id: number;
      date: string;
      capacity: number;
      timeStart: string;
      timeEnd: string;
      devices?: {id: string; quantity: number}[];
    }[]
  >([]);

  const handleAddBookingRequest = () => {
    if (isMultiDateChecked && dayjs(fromDay).isSame(dayjs(toDay))) {
      setGenericMessage(
        'From date must not be the same with To date. Please try again'
      );
      return setGenericModalShown(!isGenericModalShown);
    }
    const checkInHour = parseInt(checkInAt.split(':')[0], 10);
    const checkInMin = parseInt(checkInAt.split(':')[1], 10);

    const checkOutHour = parseInt(checkOutAt.split(':')[0], 10);
    const checkOutMin = parseInt(checkOutAt.split(':')[1], 10);
    if (
      dayjs()
        .hour(checkInHour)
        .minute(checkInMin)
        .isAfter(dayjs().hour(checkOutHour).minute(checkOutMin))
    ) {
      setGenericMessage(
        'Check-in time must be before with the check-out time. Please try again'
      );
      return setGenericModalShown(!isGenericModalShown);
    }
    if (checkInAt === checkOutAt) {
      setGenericMessage(
        'Check-in time must not be the same with check-out time. Please try again'
      );
      return setGenericModalShown(!isGenericModalShown);
    }

    if (!isMultiDateChecked && isCheckInDateTimeIsBeforeCurrentDateTime(dayjs(`${fromDay} ${checkInAt}`).toDate().getTime(), new Date().getTime())) {
      setGenericMessage(
        'Check-in date time must not be before or the same with the current date time'
      );
      return setGenericModalShown(!isGenericModalShown);
    }

    const currentDay = fromDay;

    if (
      bookingRequests.find(
        (request) =>
          request.date === currentDay && request.timeStart === checkInAt
      )
    ) {
      setGenericMessage(
        'There is a current booking request exists with the time you provided. Please try again'
      );
      return setGenericModalShown(!isGenericModalShown);
    }

    for (let i=0; i<bookingRequests.length; i++) {
      const isOverlapped = isDateRangeOverlapWithAnother({
        start: dayjs(`${fromDay} ${checkInAt}`).format('YYYY-MM-DD HH:mm'),
        end: dayjs(`${toDay} ${checkInAt}`).format('YYYY-MM-DD HH:mm'),
      }, {
        start: dayjs(`${bookingRequests[i].date} ${bookingRequests[i].timeStart}`)
          .format('YYYY-MM-DD HH:mm'),
        end: dayjs(`${bookingRequests[i].date} ${bookingRequests[i].timeEnd}`)
          .format('YYYY-MM-DD HH:mm'),
      });
      if (isOverlapped) {
        setGenericMessage(`The time range of the provided booking time is overlap with the time [${bookingRequests[i].timeStart} - ${bookingRequests[i].timeEnd}]`);
        return setGenericModalShown(true);
      }
    }

    if (isMultiDateChecked) {
      const currentDayJS = dayjs(currentDay);
      const toDayJS = dayjs(toDay).add(1, 'day');
      if (currentDayJS.isSame(toDayJS) || currentDayJS.isAfter(toDayJS)) {
        setGenericModalShown(true);
        return setGenericMessage("From date must not is the same or after than to date. Please try again.");
      }
      const providedRequests = [];

      for (let i = 0; i < toDayJS.diff(currentDayJS, 'day'); i++) {
        providedRequests.push(
          {
            id: bookingRequests.length + Math.round(Math.random() * 100000),
            timeStart: checkInAt,
            timeEnd: checkOutAt,
            capacity: capacity,
            date: currentDayJS.add(i, 'day').format("YYYY-MM-DD"),
          }
        );
      }
      setBookingRequests([
        ...bookingRequests,
        ...providedRequests
      ]);
    } else {
      setBookingRequests([
        ...bookingRequests,
        {
          id: bookingRequests.length + Math.round(Math.random() * 100000),
          timeStart: checkInAt,
          timeEnd: checkOutAt,
          capacity: capacity,
          date: currentDay,
        },
      ]);
    }

  };

  const handleAutoBookNextStep = () => {
    if (!canBook) {
      setGenericMessage(
        'Cannot book for a room because you exceed the limit of the requests. Please contact the librarians to get support'
      );
      return setGenericModalShown(true);
    }
    if (bookingRequests.length < 1) {
      setGenericMessage(
        'You must add a booking request before proceed this action.'
      );
      return setGenericModalShown(true);
    }
    dispatch(
      updateAutoBookingRequest({
        requests: bookingRequests,
      })
    );
    navigate.navigate('ROOM_BOOKING_3');
  };

  const handleRemoveBookingRequest = (requestId: number) => {
    setBookingRequests(bookingRequests.filter((request) => request.id !== requestId));
  }


  const BookingRequestsTaskMenu = () => {
    return bookingRequests.length > 1 ?
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          paddingBottom: 2,
        }}
      >
        <TouchableOpacity
          style={{
            height: 50,
            width: deviceWidth / 1.1,
            backgroundColor: FPT_ORANGE_COLOR,
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setBookingRequests([])}
        >
          <TrashIcon color={WHITE} size={deviceWidth / 16} />
          <Text
            style={{
              color: WHITE,
              fontWeight: '600',
              fontSize: deviceWidth / 21,
              paddingLeft :16,
            }}
          >
            Remove all
          </Text>
        </TouchableOpacity>
      </View> : null;
  }

  const handleSetDevices = (requestId: number, devices: {id: string; quantity: number}[]) => {
    const bookingRequest = bookingRequests.find((request) => request.id === requestId);
    bookingRequest.devices = devices;

  }

  const handleSetFromDay = (day: string) => {
    if (isMultiDateChecked && dayjs(day).isAfter(dayjs(toDay))) {
      setGenericMessage("From date must not be after the To date. Please try again!");
      return setGenericModalShown(true);
    }
    setFromDay(day);
  }

  const handleSetToDay = (day: string) => {
    if (dayjs(day).isBefore(dayjs(fromDay))) {
      setGenericMessage("To date must not be before the From date. Please try again!");
      return setGenericModalShown(true);
    }
    setToDay(day);
  }

  const [deviceRequestId, setDeviceRequestId] = useState();

  const handleSetDeviceRequestId = (id) => {
    setDeviceSelectShown(true);
    setDeviceRequestId(id);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: WHITE }}>
      <RequestRoomBookingHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.containerView}>
          <View
            style={[styles.container, getContainerHeightBasedOnMultiChecks()]}
          >
            <DateSelect
              fromDay={fromDay}
              handleSetFromDay={handleSetFromDay}
              toDay={toDay}
              handleSetToDay={handleSetToDay}
              isChecked={isMultiDateChecked}
              handleCheck={() => {
                dispatch(
                  saveMultiDate({
                    isMultiDate: !isMultiDateChecked,
                  })
                );
                setMultiDateChecked(!isMultiDateChecked);
              }}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: deviceWidth / 1.15,
                paddingHorizontal: 10,
              }}
            >
              <RequestRoomBookingTimeSelect
                value={checkInAt}
                setValue={(val) => handleSetCheckInAt(val)}
                title="Check-in at"
                height={50}
                width={deviceWidth / 2.6}
              />
              <RequestRoomBookingTimeSelect
                value={checkOutAt}
                setValue={(val) => handleSetCheckOutAt(val)}
                title="Check-out at"
                height={50}
                width={deviceWidth / 2.6}
              />
            </View>
            <RequestRoomBookingCapacitySelect
              handleSetCapacity={(val) => setCapacity(val)}
              initialCapacity={capacity}
            />

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: deviceWidth / 1.15,
              }}
            >
              <TouchableOpacity
                onPress={() => handleAddBookingRequest()}
                style={styles.searchButton}
              >
                <DocumentAddIcon color={WHITE} size={deviceWidth / 14} />
                <Text style={styles.searchButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleAutoBookNextStep()}
                style={styles.searchButton}
              >
                <TicketIcon color={WHITE} size={deviceWidth / 14} />
                <Text style={styles.searchButtonText}>Book now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            alignSelf: 'center',
            height: bookingRequests.length * 136,
          }}
        >
          {bookingRequests.map((request) => {
            return (
              <BookingRequestItem key={request.id} request={request}
                                  setDeviceSelectRequestId={(id) => handleSetDeviceRequestId(id)}
                                  handleSetDevices={(id, devices) => handleSetDevices(id, devices)}
                                  handleRemoveBookingRequest={(requestId) => handleRemoveBookingRequest(requestId)}/>
            );
          })}
        </View>
        <BookingRequestsTaskMenu/>
      </ScrollView>
      <GenericAlertModal isShown={isGenericModalShown}
                         toggleShown={() => setGenericModalShown(!isGenericModalShown)}
                         message={genericMessage} />
      <RoomBookingDeviceSelect
        setBookingRequests={(val) => setBookingRequests(val)}
        bookingRequests={bookingRequests}
                               bookingRequestId={deviceRequestId}
                               isShown={isDeviceSelectShown}
                               toggleShown={() => setDeviceSelectShown(!isDeviceSelectShown)} />
    </SafeAreaView>

  );

};

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  containerView: {
    display: 'flex',
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  searchButton: {
    marginTop: 10,
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
    height: 50,
    width: deviceWidth / 2.5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    color: WHITE,
    flexWrap: 'wrap',
  },
});

export default ScheduleRoomBookingLater;
