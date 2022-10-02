import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GRAY, WHITE } from '@app/constants';
import { deviceWidth } from '../../../utils/device';
import {
  CalendarIcon,
  ChevronDoubleRightIcon,
  LibraryIcon,
  TagIcon,
} from 'react-native-heroicons/outline';
import RNPickerSelect from 'react-native-picker-select';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';
import {
  resetGlobalDateEnd,
  resetGlobalDateStart,
} from '../../../redux/features/room-booking/slice';
import TrackBookingRoomFilterStarSelection from './status-selection';
import { fetchAllFeedBackTypes } from '../../../redux/features/feed-back-type/thunk/fetch-all-feed-back-types.thunk';
import dayjs from 'dayjs';
import { fetchAllRooms } from '../../../redux/features/room/thunk/fetch-all';

interface TrackBookingRoomFilterHandler {
  fromDate: string;
  toDate: string;
  feedbackTypeId: string;
  star: number[] | undefined;
  roomId: string;
}

interface TrackBookingRoomFilterProps {
  handleFilterSearch(): void;
}

const TrackRoomBookingFeedbackFilter: React.ForwardRefRenderFunction<
  TrackBookingRoomFilterHandler,
  TrackBookingRoomFilterProps
> = (props, ref) => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  const { feedbackTypes } = useAppSelector((state) => state.feedbackTypes);
  const rooms = useAppSelector((state) => state.room.rooms);

  const [roomId, setRoomId] = useState<string>();

  useEffect(() => {
    dispatch(fetchAllFeedBackTypes())
      .unwrap()
      .catch((e) => alert(JSON.stringify(e)));
  }, []);

  useEffect(() => {
    dispatch(fetchAllRooms())
      .unwrap()
      .catch((e) => alert(JSON.stringify(e)));
  }, []);

  const { globalDateStart, globalDateEnd } = useAppSelector(
    (state) => state.roomBooking
  );

  const [star, setStar] = useState<number[]>([]);

  const [feedbackType, setFeedbackType] = useState<string>();

  const handleSearch = () => {
    props.handleFilterSearch();
  };

  useEffect(() => {
    handleSearch();
  }, [roomId, feedbackType, globalDateStart, globalDateEnd, star]);

  useEffect(() => {
    if (!feedbackType) {
      setFeedbackType(undefined);
    }
  }, [feedbackType]);

  useImperativeHandle(ref, () => ({
    roomId: roomId,
    feedbackTypeId: feedbackType,
    fromDate: globalDateStart,
    toDate: globalDateEnd,
    star: star.length > 0 ? star : undefined,
  }));

  const handleClearFilter = useCallback(() => {
    setFeedbackType(undefined);
    setStar([]);
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
          height: 150,
          width: deviceWidth / 1.05,
          backgroundColor: WHITE,
          borderRadius: 8,
          alignSelf: 'center',
        }}
      >
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 10,
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                borderWidth: 2,
                borderColor: GRAY,
                height: 35,
                width: 35,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TagIcon size={deviceWidth / 16} color={GRAY} />
            </View>
            <RNPickerSelect
              style={{
                viewContainer: {
                  borderTopWidth: 2,
                  borderRightWidth: 2,
                  borderBottomWidth: 2,
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                  borderColor: GRAY,
                  display: 'flex',
                  width: deviceWidth / 3,
                  justifyContent: 'center',
                },
                inputAndroid: {
                  height: 35,
                  color: GRAY,
                },
                inputIOSContainer: {
                  paddingHorizontal: 10,
                },
              }}
              onValueChange={(e) => setFeedbackType(e)}
              items={feedbackTypes.map((type) => {
                return {
                  label: type.name,
                  value: type.id,
                };
              })}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                borderWidth: 2,
                borderColor: GRAY,
                height: 35,
                width: 35,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <LibraryIcon size={deviceWidth / 16} color={GRAY} />
            </View>
            <RNPickerSelect
              style={{
                viewContainer: {
                  borderTopWidth: 2,
                  borderRightWidth: 2,
                  borderBottomWidth: 2,
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                  borderColor: GRAY,
                  display: 'flex',
                  width: deviceWidth / 3,
                  justifyContent: 'center',
                },
                inputAndroid: {
                  height: 35,
                  color: GRAY,
                },
                inputIOSContainer: {
                  paddingHorizontal: 10,
                },
              }}
              onValueChange={(e) => setRoomId(e)}
              items={rooms.map((room) => {
                return {
                  label: room.name,
                  value: room.id,
                };
              })}
            />
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
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
                width: deviceWidth / 3.8,
                display: 'flex',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  color: GRAY,
                  fontWeight: '500',
                  fontSize: deviceWidth / 32,
                }}
              >
                {dayjs(globalDateStart).format('DD/MM/YYYY')}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => null}
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
                width: deviceWidth / 3.8,
                display: 'flex',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  color: GRAY,
                  fontWeight: '500',
                  fontSize: deviceWidth / 32,
                }}
              >
                {dayjs(globalDateEnd).format('DD/MM/YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TrackBookingRoomFilterStarSelection
          star={star}
          setStar={setStar}
          handleSearch={handleSearch}
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

export default forwardRef(TrackRoomBookingFeedbackFilter);
