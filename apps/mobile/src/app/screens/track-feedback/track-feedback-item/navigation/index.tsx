import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { ChevronRightIcon } from 'react-native-heroicons/outline';
import TrackBookingRequestItemNavigationStatus from './status';
import { deviceWidth } from '../../../../utils/device';

interface TrackingBookingRequestItemNavigationProps {
  status: string;
}

const TrackingBookingRequestItemNavigation: React.FC<
  TrackingBookingRequestItemNavigationProps
> = (props) => {
  return (
    <View style={styles.container}>
      <TrackBookingRequestItemNavigationStatus status={props.status} />
      <View style={styles.viewMoreButton}>
        <Text style={styles.viewMoreButtonText}>View more</Text>
        <ChevronRightIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'absolute',
    right: 10,
    top: 10,
    height: 120,
  },
  viewMoreButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 8,
    width: deviceWidth / 3.5,
    borderColor: FPT_ORANGE_COLOR,
    height: 30,
  },
  viewMoreButtonText: {
    color: FPT_ORANGE_COLOR,
    fontSize: deviceWidth / 26,
    fontWeight: '600',
  },
});

export default TrackingBookingRequestItemNavigation;
