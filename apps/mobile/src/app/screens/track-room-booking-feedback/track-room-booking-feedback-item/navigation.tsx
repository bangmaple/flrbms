import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FPT_ORANGE_COLOR, PENDING, WHITE } from '@app/constants';
import { deviceWidth } from '../../../utils/device';
import { ChevronRightIcon } from 'react-native-heroicons/outline';

interface TrackingBookingRequestItemNavigationProps {
  status: string;
}

const TrackingBookingRequestItemNavigation: React.FC<
  TrackingBookingRequestItemNavigationProps
> = (props) => {
  const StatusRender = () => {
    const getStatusViewWidth = () => {
      switch (props.status) {
        case PENDING:
          return { width: 90 };
        case 'REJECTED':
          return { width: 90 };
        case 'RESOLVED':
          return { width: 90 };
      }
    };
    return (
      <View style={[getStatusViewWidth(), styles.statusView]}>
        <Text style={styles.statusText}>{props.status}</Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { height: props.status !== 'PENDING' ? 110 : 80 },
      ]}
    >
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

export default TrackingBookingRequestItemNavigation;
