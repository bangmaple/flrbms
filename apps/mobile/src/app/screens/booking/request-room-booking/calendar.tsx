import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {BLACK, FPT_ORANGE_COLOR, WHITE} from "@app/constants";
import {CalendarIcon, ChevronLeftIcon, ChevronRightIcon, XIcon} from "react-native-heroicons/outline";
import {deviceHeight, deviceWidth} from "../../../utils/device";
import dayjs from "dayjs";
import {Calendar, DateData} from "react-native-calendars";
import AlertModal from "../../../components/modals/alert-modal.component";
import {fetchHolidays} from "../../../redux/features/holidays/thunk/fetch-holidays.thunk";
import {useAppDispatch} from "../../../hooks/use-app-dispatch.hook";
import isBetween from "dayjs/plugin/isBetween";
import {saveStartDay} from "../../../redux/features/room-booking/slice";
import {GenericAlertModal} from "./generic-alert-modal.component";
import {useAppSelector} from "../../../hooks/use-app-selector.hook";
import {fetchLastBookingDate} from "../../../redux/features/room-booking-v2/thunk/fetch-last-booking-date.thunk";
import HolidayCalendarModal from "./holiday-modal";

const LIMIT_DAY_CAN_BE_BOOKED = 21;

interface RoomBookingCalendarProps {
  isShown: boolean;
  toggleShown(): void;
  initialDate: string;
  minimumDate?: string;
  handleDayChange(dateString: string): void;
}

const RoomBookingCalendar: React.FC<RoomBookingCalendarProps> = (props) => {

  const dispatch = useAppDispatch();

  const holidays = useAppSelector((state) => state.holidays.holidays);

  const [selectedDate, setSelectedDate] = useState<string>(props.initialDate);
  const [isHolidaysLoaded, setHolidaysLoaded] = useState<boolean>(false);

  const [isGenericAlertModalShown, setGenericAlertModalShown] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>();

  const [isViolatedHoliday, setViolatedHoliday] = useState<boolean>(false);
  const [isHolidayModalOpened, setHolidayModalOpened] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchHolidays()).unwrap().then(() => setHolidaysLoaded(true));
  }, []);


  const [dateLimit, setDateLimit] = useState<{startDate: string; endDate: string}>({
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD')
  });

  useEffect(() => {
    dispatch(fetchLastBookingDate()).unwrap()
      .then((date) => {
        setDateLimit(date);
      });
  }, []);

  const currentDate = useMemo(() => {
    return dayjs().format('YYYY-MM-DD');
  }, []);

  const handleOnDayPress = (day: DateData) => {
    if (!isHolidaysLoaded) {
      return;
    }
    const dateString = day.dateString;


    let flag = true;
    holidays.forEach((holiday) => {
      const providedDay = dayjs(dateString);
      const startDay = dayjs(holiday.start).startOf('hour');
      const endDay = dayjs(holiday.end).endOf('day');

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const isBetween = require('dayjs/plugin/isBetween')
      dayjs.extend(isBetween)

      // @ts-ignore
      if (providedDay.isBetween(startDay, endDay, 'day', '[]')) {
        flag = false;
        setViolatedHoliday(true);
        setAlertMessage("The day you are choosing is violated with the holiday: " + holiday.name +  ". From: "
          + startDay.format("MM/DD/YYYY") +  ". To: " + endDay.format("MM/DD/YYYY"));
        return setGenericAlertModalShown(true);
      }
    });
      if (flag === true) {
        setViolatedHoliday(false);
        setSelectedDate(dateString);
      }

    //props.handleDayChange(dateString);
  }

  const handleConfirmSelectedDate = () => {
    if (!isHolidaysLoaded) {
      return;
    }
    if (isViolatedHoliday) {
      return setGenericAlertModalShown(true);
    }
    props.handleDayChange(selectedDate);
    props.toggleShown();
  }

  const handleShowHolidays = () => {
    if (!holidays || holidays.length < 1) {
      setGenericAlertModalShown(true);
      return setAlertMessage("There is no holidays currently. If this is a mistake, contact to the librarians.");
    }
    setHolidayModalOpened(true);
  }

  const Header = () => {
    return (
      <View style={{alignSelf: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center', width: deviceWidth / 1.15, justifyContent: 'space-between'}}>
        <HolidayCalendarModal isOpened={isHolidayModalOpened} toggleOpen={() => setHolidayModalOpened(!isHolidayModalOpened)}/>
        <Text style={{color: BLACK, fontWeight: '600', fontSize: deviceWidth / 21}}>Choose your check-in date</Text>
        <TouchableOpacity style={{paddingLeft: 10, borderRadius: 50, height: 30, width: deviceWidth / 3.7, borderWidth: 2,
          borderColor: FPT_ORANGE_COLOR, display: 'flex', flexDirection: 'row', alignItems: 'center'}} onPress={() => handleShowHolidays()}>
          <CalendarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 18}/>
          <Text style={{color: FPT_ORANGE_COLOR, fontWeight: '600', fontSize: deviceWidth / 28, paddingLeft: 6}}>Holidays</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const Footer = () => {
    return (
      <View style={{width: deviceWidth / 1.05, display: 'flex', flexDirection :'row', paddingTop: 10, justifyContent: 'space-around'}}>

        <TouchableOpacity style={{
          backgroundColor: WHITE, height: 50, borderColor: FPT_ORANGE_COLOR, borderWidth: 2,
          width: deviceWidth / 2.4, justifyContent: 'center', alignItems: 'center',
          borderRadius: 8, flexDirection: 'row',
        }} onPress={() => props.toggleShown()}>
          <XIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 16}/>
          <Text style={{color: FPT_ORANGE_COLOR, fontWeight: '600', fontSize: deviceWidth / 21, paddingLeft: 8,}}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          backgroundColor: FPT_ORANGE_COLOR, height: 50,
          width: deviceWidth / 2.4, justifyContent: 'center', alignItems: 'center',
          borderRadius: 8, flexDirection: 'row'
        }} onPress={() => handleConfirmSelectedDate()}>
          <CalendarIcon color={WHITE} size={deviceWidth / 16}/>
          <Text style={{color: WHITE, fontWeight: '600', fontSize: deviceWidth / 21, paddingLeft: 8,}}>Confirm</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <AlertModal isOpened={props.isShown}
                height={deviceHeight / 1.5}
                width={deviceWidth / 1.05}
                toggleShown={() => props.toggleShown()}>
      <GenericAlertModal isShown={isGenericAlertModalShown} toggleShown={() => {
        setGenericAlertModalShown(!isGenericAlertModalShown);
      }} message={alertMessage}/>
      <View style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        height: deviceHeight / 1.5
      }}>
        <Header/>
        <Calendar
          disabledByDefault={!isHolidaysLoaded}
          initialDate={currentDate}
          minDate={dateLimit.startDate}
          maxDate={dateLimit.endDate}
          onDayPress={handleOnDayPress}
          markedDates={{
            [selectedDate]: {
              marked: true,
              selected: true,
              selectedColor: FPT_ORANGE_COLOR,
            },
          }}
          renderArrow={(direction) => (
            <View>
              {direction === 'left' ? (
                <View style={styles.chevronLeftBtn}>
                  <ChevronLeftIcon color={FPT_ORANGE_COLOR} />
                </View>
              ) : (
                <View style={styles.chevronRightBtn}>
                  <ChevronRightIcon color={FPT_ORANGE_COLOR} />
                </View>
              )}
            </View>
          )}
          style={{
            justifyContent: 'flex-start',
            width: deviceWidth / 1.05
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
        <Footer/>
      </View>
    </AlertModal>

  );
};

const styles = StyleSheet.create({
  chevronLeftBtn: {
    width: deviceWidth / 11,
    height: deviceWidth / 11,
    borderRadius: 8,
    borderColor: FPT_ORANGE_COLOR,
    borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronRightBtn: {
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

export default RoomBookingCalendar;
