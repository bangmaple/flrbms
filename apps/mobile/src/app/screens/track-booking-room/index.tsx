import React, { useRef } from 'react';
import {
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet,
  VirtualizedList,
} from 'react-native';
import { useAppDispatch } from '../../hooks/use-app-dispatch.hook';
import TrackBookingRoomFilter from './filter';
import BookingRequestItem from './track-booking-request-item';
import { fetchBookingRoomsByFilters } from '../../redux/features/room-booking/thunk/fetch-booking-room-by-filters.thunk';
import { useAppSelector } from '../../hooks/use-app-selector.hook';
import { BookingRoomsByFiltersResponse } from '../../redux/models/booking-rooms-by-filters-response.model';
import TrackBookingRoomNotFound from './not-found';

const TrackBookingRoom: React.FC<any> = () => {
  const dispatch = useAppDispatch();

  const { filteredBookingRequests } = useAppSelector(
    (state) => state.roomBooking
  );

  const filterRef =
    useRef<React.ElementRef<typeof TrackBookingRoomFilter>>(null);

  const handleFilterSearch = () => {
    dispatch(fetchBookingRoomsByFilters(filterRef.current))
      .unwrap()
      .catch(() => alert('Error while fetching data'));
  };

  const TrackBookingRoomList = () => {
    return (
      <VirtualizedList
        showsVerticalScrollIndicator={false}
        data={filteredBookingRequests}
        getItemCount={(data) => data.length}
        getItem={(data, index) => data[index]}
        renderItem={(
          item: ListRenderItemInfo<BookingRoomsByFiltersResponse>
        ) => <BookingRequestItem  item={item.item} />}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TrackBookingRoomFilter
        ref={filterRef}
        handleFilterSearch={() => handleFilterSearch()}
      />
      {filteredBookingRequests?.length < 1 ? (
        <TrackBookingRoomNotFound />
      ) : (
        <TrackBookingRoomList />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default TrackBookingRoom;
