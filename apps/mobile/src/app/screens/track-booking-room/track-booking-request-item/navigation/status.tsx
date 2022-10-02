import React from 'react';
import {
  BOOKED,
  CANCELLED,
  CHECKED_IN,
  CHECKED_OUT,
  FPT_ORANGE_COLOR,
  PENDING,
  WHITE,
} from '@app/constants';
import { StyleSheet, Text, View } from 'react-native';
import { deviceWidth } from '../../../../utils/device';

interface TrackBookingRequestItemNavigationStatusProps {
  status: string;
}
const TrackBookingRequestItemNavigationStatus: React.FC<
  TrackBookingRequestItemNavigationStatusProps
> = (props) => {
  const getStatusViewWidth = () => {
    switch (props.status) {
      case PENDING:
        return { width: 90 };
      case CHECKED_IN:
        return { width: 110 };
      case CHECKED_OUT:
        return { width: 120 };
      case CANCELLED:
        return { width: 100 };
      case BOOKED:
        return { width: 80 };
    }
  };

  const getStatusTextTransformed = () => {
    switch (props.status) {
      case CHECKED_IN:
        return 'CHECKED IN';
      case CHECKED_OUT:
        return 'CHECKED OUT';
      default:
        return props.status;
    }
  };
  return (
    <View style={[getStatusViewWidth(), styles.statusView]}>
      <Text style={styles.statusText}>{getStatusTextTransformed()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    height: 25,
    backgroundColor: FPT_ORANGE_COLOR,
    alignSelf: 'flex-end',
  },
  statusText: {
    fontSize: deviceWidth / 30,
    fontWeight: '600',
    color: WHITE,
  },
});

export default TrackBookingRequestItemNavigationStatus;
