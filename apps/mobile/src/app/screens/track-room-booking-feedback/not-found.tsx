import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NotFound from '../../components/empty.svg';
import { deviceHeight, deviceWidth } from '../../utils/device';
import { BLACK } from '@app/constants';

const TrackBookingRoomNotFound: React.FC<any> = () => {
  return (
    <View style={styles.container}>
      <NotFound width={deviceWidth / 1.5} height={deviceHeight / 2.5} />
      <Text style={styles.text}>Data not found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  text: {
    color: BLACK,
    fontSize: deviceWidth / 19,
    fontWeight: '600',
  },
});

export default TrackBookingRoomNotFound;
