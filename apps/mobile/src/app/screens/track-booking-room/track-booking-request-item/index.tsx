import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { WHITE } from '@app/constants';
import { deviceWidth } from '../../../utils/device';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import { fetchRoomBookingById } from '../../../redux/features/room-booking/thunk/fetch-room-booking-by-id.thunk';
import { BookingRoomsByFiltersResponse } from '../../../redux/models/booking-rooms-by-filters-response.model';
import TrackBookingRequestItemContent from './content';
import TrackingBookingRequestItemNavigation from './navigation';
import { boxShadow } from '../../../utils/box-shadow.util';

interface BookingRequestItemProps {
  item: BookingRoomsByFiltersResponse;
}
const BookingRequestItem: React.FC<BookingRequestItemProps> = (props) => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  const handleFetchBookingRequest = (id: string) => {
    dispatch(fetchRoomBookingById(id))
      .unwrap()
      .then(() => navigate.navigate('ACCEPT_ROOM_BOOKING'))
      .catch(() => alert('Failed while fetching data'));
  };

  return (
    <TouchableOpacity
      onPress={() => handleFetchBookingRequest(props.item.id)}
      style={[boxShadow(styles), styles.container]}
      // @ts-ignore
      key={props.item}
    >
      <TrackBookingRequestItemContent item={props.item} />
      <TrackingBookingRequestItemNavigation status={props.item.status} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 140,
    backgroundColor: WHITE,
    width: deviceWidth / 1.05,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

export default BookingRequestItem;
