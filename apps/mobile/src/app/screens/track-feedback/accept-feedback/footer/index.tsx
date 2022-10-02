import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FPT_ORANGE_COLOR, INPUT_GRAY_COLOR, WHITE } from '@app/constants';
import { deviceWidth } from '../../../../utils/device';
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/outline';

interface AcceptBookingFooterProps {
  handleReject(): void;
  handleAccept(): void;
}

const ResolveFeedbackFooter: React.FC<AcceptBookingFooterProps> = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => props.handleReject()}
        style={styles.goBackButton}
      >
        <XCircleIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 14} />
        <Text style={styles.goBackButtonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.handleAccept()}
        style={styles.acceptButton}
      >
        <CheckCircleIcon color={WHITE} size={deviceWidth / 14} />
        <Text style={styles.acceptButtonText}>Resolve</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: WHITE,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: INPUT_GRAY_COLOR,
  },
  goBackButton: {
    width: deviceWidth / 2.5,
    height: 50,
    borderWidth: 2,
    borderColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  goBackButtonText: {
    marginLeft: 10,
    color: FPT_ORANGE_COLOR,
    fontSize: deviceWidth / 19,
    fontWeight: '600',
  },
  acceptButton: {
    width: deviceWidth / 2.5,
    height: 50,
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  acceptButtonText: {
    marginLeft: 10,
    color: WHITE,
    fontSize: deviceWidth / 19,
    fontWeight: '600',
  },
});

export default ResolveFeedbackFooter;
