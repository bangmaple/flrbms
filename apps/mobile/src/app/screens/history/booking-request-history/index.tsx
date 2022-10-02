import React, { useRef } from 'react';
import {
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  VirtualizedList,
} from 'react-native';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';
import NotFound from '../../components/empty.svg';
import { deviceHeight, deviceWidth } from '../../../utils/device';
import { BLACK } from '@app/constants';
import { BookingRoomsByFiltersResponse } from '../../../redux/models/booking-rooms-by-filters-response.model';
import { fetchAllBookingRoomHistory } from '../../../redux/features/room-booking/thunk/fetch-all-booking-room-history.thunk';
import BookingRoomHistoryFilter from './filter';

const TrackBookingRoom: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const navigate = useAppNavigation();

  const { filteredBookingRequests } = useAppSelector(
    (state) => state.roomBooking
  );

  const filterRef =
    useRef<React.ElementRef<typeof BookingRoomHistoryFilter>>(null);

  const handleFilterSearch = () => {
    dispatch(fetchAllBookingRoomHistory(filterRef.current))
      .unwrap()
      .catch(() => alert('Error while fetching data'));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BookingRoomHistoryFilter
        ref={filterRef}
        handleFilterSearch={() => handleFilterSearch()}
      />
      {filteredBookingRequests?.length < 1 ? (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <NotFound width={deviceWidth / 1.5} height={deviceHeight / 2.5} />
          <Text
            style={{
              color: BLACK,
              fontSize: deviceWidth / 19,
              fontWeight: '600',
            }}
          >
            Data not found
          </Text>
        </View>
      ) : (
        <VirtualizedList
          showsVerticalScrollIndicator={false}
          data={filteredBookingRequests}
          getItemCount={(data) => data.length}
          getItem={(data, index) => data[index]}
          renderItem={(
            item: ListRenderItemInfo<BookingRoomsByFiltersResponse>
          ) => null}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default TrackBookingRoom;
