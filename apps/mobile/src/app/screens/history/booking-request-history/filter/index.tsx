import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FPT_ORANGE_COLOR, GRAY, WHITE } from '@app/constants';
import { deviceWidth } from '../../../../utils/device';
import {
  CalendarIcon,
  CheckIcon,
  ChevronDoubleRightIcon,
  ClockIcon,
  SearchIcon,
} from 'react-native-heroicons/outline';
import DelayInput from 'react-native-debounce-input';
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select';
import { useAppNavigation } from '../../../../hooks/use-app-navigation.hook';
import { useAppDispatch } from '../../../../hooks/use-app-dispatch.hook';
import dayjs from 'dayjs';
import { useAppSelector } from '../../../../hooks/use-app-selector.hook';
import { fetchAllSlots } from '../../../../redux/features/slot';
import {
  resetGlobalDateEnd,
  resetGlobalDateStart,
} from '../../../../redux/features/room-booking/slice';

interface BookingRoomHistoryFilterHandler {
  slotStart: number;
  slotEnd: number;
  dateStart: string;
  dateEnd: string;
  roomName: string;
  status: string[] | undefined;
}

interface BookingRoomHistoryFilterProps {
  handleFilterSearch(): void;
}

const statusData = [
  {
    id: 0,
    label: 'All',
    value: undefined,
    style: { width: deviceWidth / 9.5 },
    slotContainerLeftStyle: { left: 5 },
  },
  {
    id: 1,
    label: 'Pending',
    value: 'PENDING',
    style: { width: deviceWidth / 5.5 },
    slotContainerLeftStyle: { left: 55 },
  },
  {
    id: 2,
    label: 'Booked',
    value: 'BOOKED',
    style: { width: deviceWidth / 6 },
    slotContainerLeftStyle: { left: 135 },
  },
  {
    id: 3,
    label: 'Checked In',
    value: 'CHECKED_IN',
    style: { width: deviceWidth / 4.5 },
    slotContainerLeftStyle: { left: 210 },
  },
  {
    id: 4,
    label: 'Checked Out',
    value: 'CHECKED_OUT',
    style: { width: deviceWidth / 4 },
    slotContainerLeftStyle: { left: 310 },
  },
  {
    id: 5,
    label: 'Cancelled',
    value: 'CANCELLED',
    style: { width: deviceWidth / 5 },
    slotContainerLeftStyle: { left: 415 },
  },
];
const BookingRoomHistoryFilter: React.ForwardRefRenderFunction<
  BookingRoomHistoryFilterHandler,
  BookingRoomHistoryFilterProps
> = (props, ref) => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  const { slots } = useAppSelector((state) => state.slot);

  useEffect(() => {
    dispatch(fetchAllSlots())
      .unwrap()
      .catch((e) => alert(JSON.stringify(e)));
  }, []);
  const { globalDateStart, globalDateEnd } = useAppSelector(
    (state) => state.roomBooking
  );

  const [slotStart, setSlotStart] = useState(1);
  const [slotEnd, setSlotEnd] = useState(100);

  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string[]>([]);

  const handleSearch = () => {
    props.handleFilterSearch();
  };

  useEffect(() => {
    handleSearch();
  }, [search, status.length, globalDateStart, globalDateEnd]);

  useEffect(() => {
    if (slots.length > 0) {
      setSlotStart(slots[0].slotNum);
      setSlotEnd(slots[slots.length - 1].slotNum);
    }
  }, [slots]);

  useImperativeHandle(ref, () => ({
    slotEnd,
    slotStart,
    dateStart: globalDateStart,
    dateEnd: globalDateEnd,
    roomName: search,
    status: status.length < 1 ? undefined : status,
  }));

  const inputRef = useRef(null);

  const handleClearFilter = useCallback(() => {
    setSearch('');
    setSlotStart(slots[0]?.slotNum);
    setSlotEnd(slots[slots.length - 1]?.slotNum);
    setStatus([]);
    dispatch(resetGlobalDateStart());
    dispatch(resetGlobalDateEnd());
  }, []);

  const renderSlotData = () => {
    return slots
      ? slots.map((slot) => {
          return {
            label: slot.name,
            value: slot.slotNum,
          };
        })
      : [];
  };

  return (
    <>
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          margin: 10,
        }}
      >
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
            <SearchIcon color={GRAY} size={deviceWidth / 16} />
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
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            <View style={styles.leftIconSlotFilter}>
              <CalendarIcon color={GRAY} size={deviceWidth / 16} />
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
              setSlotStart(slotEnd);
              setSlotEnd(slotStart);
            }}
            style={styles.switchIconContainer}
          >
            <ChevronDoubleRightIcon color={GRAY} size={deviceWidth / 16} />
          </TouchableOpacity>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={styles.leftIconSlotFilter}>
              <CalendarIcon color={GRAY} size={deviceWidth / 16} />
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
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={styles.leftIconSlotFilter}>
              <ClockIcon color={GRAY} size={deviceWidth / 16} />
            </View>
            <RNPickerSelect
              value={slotStart}
              style={slotFilterContainer}
              onValueChange={(e) => setSlotStart(e)}
              onDonePress={() => handleSearch()}
              items={renderSlotData()}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              setSlotStart(slotEnd);
              setSlotEnd(slotStart);
            }}
            style={styles.switchIconContainer}
          >
            <ChevronDoubleRightIcon color={GRAY} size={deviceWidth / 16} />
          </TouchableOpacity>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={styles.leftIconSlotFilter}>
              <ClockIcon color={GRAY} size={deviceWidth / 16} />
            </View>
            <RNPickerSelect
              value={slotEnd}
              style={slotFilterContainer}
              onValueChange={(e) => setSlotEnd(e)}
              onDonePress={() => handleSearch()}
              items={renderSlotData()}
            />
          </View>
        </View>

        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              height: 60,
              alignItems: 'center',
            }}
          >
            {statusData.map((statusFilter) => (
              <>
                <TouchableOpacity
                  onPress={() => {
                    if (
                      !status.some((val) => statusFilter.value === val) &&
                      statusFilter.value
                    ) {
                      setStatus([...status, statusFilter.value]);
                    } else if (
                      status.some((val) => statusFilter.value === val)
                    ) {
                      setStatus(
                        status.filter((stt) => stt !== statusFilter.value)
                      );
                    } else if (!statusFilter.value) {
                      setStatus([]);
                    }
                  }}
                  key={statusFilter.id}
                  style={[styles.filterTypeButton, statusFilter.style]}
                >
                  <Text style={styles.filterTypeText}>
                    {statusFilter.label}
                  </Text>
                </TouchableOpacity>
                {status.some((val) => val === statusFilter.value) ? (
                  <View
                    style={[
                      styles.selectContainer,
                      statusFilter.slotContainerLeftStyle,
                    ]}
                  >
                    <CheckIcon color={WHITE} size={deviceWidth / 30} />
                  </View>
                ) : status.length < 1 ? (
                  <View style={[styles.selectContainer, { left: 5 }]}>
                    <CheckIcon color={WHITE} size={deviceWidth / 30} />
                  </View>
                ) : null}
              </>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

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
    marginLeft: 10,
    fontWeight: '500',
    fontSize: deviceWidth / 32,
  },
};

const styles = StyleSheet.create({
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
  filterTypeButton: {
    marginLeft: 10,
    borderRadius: 8,
    height: 30,
    borderColor: FPT_ORANGE_COLOR,
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTypeText: {
    color: FPT_ORANGE_COLOR,
    fontWeight: '600',
    fontSize: deviceWidth / 30,
  },

  selectContainer: {
    height: 15,
    width: 15,
    borderRadius: 50,
    backgroundColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
  },
});

export default forwardRef(BookingRoomHistoryFilter);
