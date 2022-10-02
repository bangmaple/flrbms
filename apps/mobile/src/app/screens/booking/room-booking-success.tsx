import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Success from '../../components/success.svg';
import { deviceHeight, deviceWidth } from '../../utils/device';
import {
  BLACK,
  FPT_ORANGE_COLOR,
  INPUT_GRAY_COLOR,
  WHITE,
} from '@app/constants';
import QRCode from 'react-native-qrcode-svg';
import { useAppNavigation } from '../../hooks/use-app-navigation.hook';
import { useAppSelector } from '../../hooks/use-app-selector.hook';
import { HomeIcon } from 'react-native-heroicons/outline';

export const RoomBookingSuccess: React.FC = () => {
  const navigate = useAppNavigation();
  const response = useAppSelector((state) => state.roomBooking.response);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          <Success
            height={deviceWidth / 2.2}
            width={deviceWidth / 2.2}
          />
          <Text style={styles.title}>
            {' '}
            Your room has successfully been booked!
          </Text>
          <Text style={styles.subTitle}>
            Please check-in your library in time
          </Text>
        </View>


        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => navigate.replace('MAIN')}
            style={styles.backToHomeButton}
          >
            <HomeIcon size={deviceWidth / 14} color={WHITE} />
            <Text style={styles.backToHomeButtonText}>Back to home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: deviceWidth / 19,
    color: BLACK,
    textAlign: 'center',
  },
  subTitle: {
    color: BLACK,
    fontWeight: '400',
    fontSize: deviceWidth / 23,
  },
  qrContainer: {
    width: deviceWidth / 1.3,
    height: deviceHeight / 4,
    backgroundColor: WHITE,
    borderRadius: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  qrContainerText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    height: 80,
    backgroundColor: WHITE,
    borderTopColor: INPUT_GRAY_COLOR,
    borderTopWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToHomeButton: {
    borderRadius: 8,
    backgroundColor: FPT_ORANGE_COLOR,
    width: deviceWidth / 1.25,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backToHomeButtonText: {
    color: WHITE,
    fontWeight: '600',
    fontSize: deviceWidth / 19,
    marginLeft: 10,
  },
});
