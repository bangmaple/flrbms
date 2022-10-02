import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import { deviceWidth } from '../../../utils/device';
import { BLACK, GRAY } from '@app/constants';
import { BookingRoomsByFiltersResponse } from '../../../redux/models/booking-rooms-by-filters-response.model';

interface TrackBookingRequestItemContentProps {
  item: BookingRoomsByFiltersResponse;
}

const TrackBookingRequestItemContent: React.FC<
  TrackBookingRequestItemContentProps
> = (props) => {
  const SlotRender = () => {
    return (
      <Text style={styles.textValue}>
         {props.item.checkinTime.slice(0,5)} - {props.item.checkoutTime.slice(0,5)}
      </Text>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.rowRender}>
        <Text style={styles.textTitle}>Requested by:</Text>
        <Text style={styles.textValue}>{props.item.requestedBy}</Text>
      </View>
      <View style={[{ marginTop: 10 }, styles.rowRender]}>
        <Text style={styles.textTitle}>Room name:</Text>
        <Text style={styles.textValue}>{props.item.roomName}</Text>
      </View>
      <View style={[{ marginTop: 10 }, styles.rowRender]}>
        <Text style={styles.textTitle}>Room type:</Text>
        <Text style={styles.textValue}>{props.item.roomType}</Text>
      </View>
      <View style={[{ marginTop: 10 }, styles.rowRender]}>
        <Text style={styles.textTitle}>Checkin date:</Text>
        <Text style={styles.textValue}>
          {dayjs(props.item.checkinDate).format('DD/MM/YYYY')}
        </Text>
      </View>
      <View style={[{ marginTop: 10 }, styles.rowRender]}>
        <Text style={styles.textTitle}>Time:</Text>
        <SlotRender />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  rowRender: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textTitle: {
    fontWeight: '600',
    fontSize: deviceWidth / 30,
    color: BLACK,
  },
  textValue: {
    marginLeft: 5,
    fontWeight: '400',
    fontSize: deviceWidth / 30,
    color: GRAY,
  },
});

export default TrackBookingRequestItemContent;
