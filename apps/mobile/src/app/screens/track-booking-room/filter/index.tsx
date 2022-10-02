import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState,} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GRAY, WHITE} from '@app/constants';
import {deviceWidth} from '../../../utils/device';
import {CalendarIcon, ChevronDoubleRightIcon, ClockIcon, SearchIcon,} from 'react-native-heroicons/outline';
import DelayInput from 'react-native-debounce-input';
import {PickerStyle} from 'react-native-picker-select';
import {useAppNavigation} from '../../../hooks/use-app-navigation.hook';
import {useAppDispatch} from '../../../hooks/use-app-dispatch.hook';
import dayjs from 'dayjs';
import {useAppSelector} from '../../../hooks/use-app-selector.hook';
import {resetGlobalDateEnd, resetGlobalDateStart,} from '../../../redux/features/room-booking/slice';
import TrackBookingRoomFilterStatusSelection from './status-selection';
import DatePicker from 'react-native-date-picker';

interface TrackBookingRoomFilterHandler {
  checkinTime: string;
  checkoutTime: string;
  dateStart: string;
  dateEnd: string;
  roomName: string;
  status: string[] | undefined;
}

interface TrackBookingRoomFilterProps {
  handleFilterSearch(): void;
}

const TrackBookingRoomFilter: React.ForwardRefRenderFunction<TrackBookingRoomFilterHandler,
  TrackBookingRoomFilterProps> = (props, ref) => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  const {globalDateStart, globalDateEnd} = useAppSelector(
    (state) => state.roomBooking
  );


  const [checkinTime, setCheckinTime] = useState('01:00:00');
  const [isCheckinTimeModalOpen, setCheckinTimeModalOpen] = useState(false);

  const [checkoutTime, setCheckoutTime] = useState('23:00:00');
  const [isCheckoutTimeModalOpen, setCheckoutTimeModalOpem] = useState(false);

  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string[]>([]);

  const handleSearch = () => {
    props.handleFilterSearch();
  };

  useEffect(() => {
    if (checkinTime > checkoutTime) {
      alert("Check-out time must be greater than Check-out time")
      setCheckinTime('01:00:00');
      setCheckoutTime('23:00:00');
    } else {
      handleSearch()
    }

  }, [search, globalDateStart, globalDateEnd, status, checkoutTime, checkinTime]);


  useImperativeHandle(ref, () => ({
    checkinTime,
    checkoutTime,
    dateStart: globalDateStart,
    dateEnd: globalDateEnd,
    roomName: search,
    status: status.length > 0 ? status : undefined,
  }));

  const inputRef = useRef(null);

  const handleClearFilter = useCallback(() => {
    setSearch('');
    setStatus([]);
    dispatch(resetGlobalDateStart());
    dispatch(resetGlobalDateEnd());
  }, []);


  return (
    <View>
      <View style={styles.container}>
        <Text
          style={{
            color: GRAY,
            fontWeight: '600',
            fontSize: deviceWidth / 23,
          }}
        >
          FILTER
        </Text>
        <TouchableOpacity
          onPress={() => handleClearFilter()}
          style={styles.clearFilterButton}
        >
          <Text style={styles.clearFilterInputText}>CLEAR</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 190,
          width: deviceWidth / 1.05,
          backgroundColor: WHITE,
          borderRadius: 8,
          alignSelf: 'center',
        }}
      >
        <View style={styles.searchInputContainer}>
          <View style={styles.searchInputIcon}>
            <SearchIcon color={GRAY} size={deviceWidth / 16}/>
          </View>
          <DelayInput
            minLength={1}
            ref={inputRef}
            delayTimeout={400}
            placeholder="Search by room name..."
            style={styles.searchInput}
            value={search}
            onChangeText={(e) => setSearch(e.toString())}
          />
        </View>
        <View
          style={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigate.navigate('CALENDAR_SELECT', {
                type: 'dateStart',
              })
            }
            style={{display: 'flex', flexDirection: 'row'}}
          >
            <View style={styles.leftIconSlotFilter}>
              <CalendarIcon color={GRAY} size={deviceWidth / 16}/>
            </View>
            <View
              style={{
                borderWidth: 2,
                borderColor: GRAY,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
                height: 35,
                width: deviceWidth / 3.4,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: GRAY,
                  marginLeft: 10,
                  fontWeight: '500',
                  fontSize: deviceWidth / 32,
                }}
              >
                {dayjs(globalDateStart).format('DD/MM/YYYY')}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setCheckinTime(checkoutTime);
              setCheckoutTime(checkinTime);
            }}
            style={styles.switchIconContainer}
          >
            <ChevronDoubleRightIcon color={GRAY} size={deviceWidth / 16}/>
          </TouchableOpacity>

          <View style={{display: 'flex', flexDirection: 'row'}}>
            <View style={styles.leftIconSlotFilter}>
              <CalendarIcon color={GRAY} size={deviceWidth / 16}/>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigate.navigate('CALENDAR_SELECT', {
                  type: 'dateEnd',
                })
              }
              style={{
                borderWidth: 2,
                borderColor: GRAY,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
                height: 35,
                width: deviceWidth / 3.4,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: GRAY,
                  marginLeft: 10,
                  fontWeight: '500',
                  fontSize: deviceWidth / 32,
                }}
              >
                {dayjs(globalDateEnd).format('DD/MM/YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <View style={styles.leftIconSlotFilter}>
              <ClockIcon color={GRAY} size={deviceWidth / 16}/>
            </View>
            <TouchableOpacity
              onPress={() => setCheckinTimeModalOpen(true)}
              style={styles.timeContainer}
            >
              <Text>{checkinTime}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              setCheckinTime(checkoutTime);
              setCheckoutTime(checkinTime);
            }}
            style={styles.switchIconContainer}
          >
            <ChevronDoubleRightIcon color={GRAY} size={deviceWidth / 16}/>
          </TouchableOpacity>

          <View style={{display: 'flex', flexDirection: 'row'}}>
            <View style={styles.leftIconSlotFilter}>
              <ClockIcon color={GRAY} size={deviceWidth / 16}/>
            </View>
            <TouchableOpacity
              onPress={() => setCheckoutTimeModalOpem(true)}
              style={styles.timeContainer}
            >
              <Text>{checkoutTime}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TrackBookingRoomFilterStatusSelection
          status={status}
          setStatus={setStatus}
          handleSearch={handleSearch}
        />
        <DatePicker
          date={new Date()}
          mode="time"
          modal
          open={isCheckinTimeModalOpen}
          onConfirm={(date) => {
            setCheckinTimeModalOpen(false);
            setCheckinTime(`${date.getHours()}:${date.getMinutes()}:00`);
          }}
          onCancel={() => {
            setCheckinTimeModalOpen(false);
          }}
        />
        <DatePicker
          date={new Date()}
          mode="time"
          modal
          open={isCheckoutTimeModalOpen}
          onConfirm={(date) => {
            setCheckoutTimeModalOpem(false);
            setCheckoutTime(`${date.getHours()}:${date.getMinutes()}:00`);
          }}
          onCancel={() => {
            setCheckinTimeModalOpen(false);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
  },
  timeContainer: {
    borderWidth: 2,
    borderColor: GRAY,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    height: 35,
    width: deviceWidth / 3.4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearFilterButton: {
    height: 20,
    width: 50,
    borderRadius: 8,
    backgroundColor: GRAY,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearFilterInputText: {
    color: WHITE,
    fontWeight: '500',
    fontSize: deviceWidth / 34,
  },
  searchInputContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  searchInputIcon: {
    height: 35,
    width: 35,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderColor: GRAY,
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 35,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: GRAY,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    width: deviceWidth / 1.23,
    paddingHorizontal: 10,
  },
  leftIconSlotFilter: {
    height: 35,
    width: 35,
    borderTopColor: GRAY,
    borderLeftColor: GRAY,
    borderBottomColor: GRAY,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchIconContainer: {
    height: 35,
    width: 35,
    borderWidth: 2,
    borderColor: GRAY,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const slotFilterContainer: PickerStyle = {
  viewContainer: {
    borderWidth: 2,
    borderColor: GRAY,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    height: 35,
    width: deviceWidth / 3.4,
    display: 'flex',
    justifyContent: 'center',
  },
  inputIOS: {
    color: GRAY,
    marginLeft: 10,
    fontWeight: '500',
    fontSize: deviceWidth / 32,
  },
  inputAndroid: {
    color: GRAY,
    marginLeft: -10,
    fontWeight: '500',
    fontSize: deviceWidth / 32,
  },
};
export default forwardRef(TrackBookingRoomFilter);
