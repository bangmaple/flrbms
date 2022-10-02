import React from 'react';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import { ChevronLeftIcon, HomeIcon } from 'react-native-heroicons/outline';
import { deviceHeight, deviceWidth } from '../../../utils/device';
import SuccessAcceptBookingRequestIcon from '../../../icons/success-accept-booking-request.svg';

const SuccessfullyAcceptedBookingRequest: React.FC<any> = () => {
  const navigate = useAppNavigation();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <View style={styles.container}>
        <SuccessAcceptBookingRequestIcon
          width={deviceWidth / 1.5}
          height={deviceHeight / 2.5}
        />
        <Text
          style={{
            fontWeight: '600',
            fontSize: deviceWidth / 19,
            textAlign: 'center',
          }}
        >
          Successfully accepted the booking request!
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigate.replace('MAIN')}
          style={styles.backHomeButton}
        >
          <HomeIcon size={deviceWidth / 14} color={FPT_ORANGE_COLOR} />
          <Text style={styles.backHomeButtonText}>Back to home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate.replace('TRACK_BOOKING_ROOM')}
          style={styles.continueButton}
        >
          <ChevronLeftIcon size={deviceWidth / 14} color={WHITE} />
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    height: 80,
    backgroundColor: WHITE,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backHomeButton: {
    height: 50,
    width: deviceWidth / 2.1,
    borderColor: FPT_ORANGE_COLOR,
    borderWidth: 2,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  backHomeButtonText: {
    fontSize: deviceWidth / 20,
    fontWeight: '500',
    color: FPT_ORANGE_COLOR,
  },
  continueButton: {
    height: 50,
    width: deviceWidth / 2.3,
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: deviceWidth / 20,
    fontWeight: '500',
    color: WHITE,
  },
});

export default SuccessfullyAcceptedBookingRequest;
