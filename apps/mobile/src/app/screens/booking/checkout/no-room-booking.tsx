import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EmptyCheckOut from '../../../components/empty-checkout.svg';
import { deviceWidth } from '../../../utils/device';
import { BLACK, FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import { HomeIcon, TicketIcon } from 'react-native-heroicons/outline';

const NoRoomBookingCheckOut: React.FC<any> = () => {
  const navigate = useAppNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.body}>
          <EmptyCheckOut width={deviceWidth / 1.3} height={deviceWidth / 1.3} />
          <Text style={styles.bodyTextContent}>
            Your booking room is already checked out or not checked in!
          </Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => navigate.replace('MAIN')}
            style={styles.backHomeButton}
          >
            <HomeIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 14} />
            <Text style={styles.backHomeButtonText}>Back home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate.replace('ROOM_BOOKING')}
            style={styles.checkInButton}
          >
            <TicketIcon color={WHITE} size={deviceWidth / 14} />
            <Text style={styles.checkInButtonText}>Start booking</Text>
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
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flexGrow: 1,
  },
  bodyTextContent: {
    color: BLACK,
    fontSize: deviceWidth / 18,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  footer: {
    height: 90,
    backgroundColor: WHITE,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backHomeButton: {
    borderRadius: 8,
    height: 50,
    borderWidth: 2,
    width: deviceWidth / 2.3,
    borderColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backHomeButtonText: {
    color: FPT_ORANGE_COLOR,
    fontSize: deviceWidth / 18,
    fontWeight: '600',
  },
  checkInButton: {
    flexDirection: 'row',
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
    height: 50,
    width: deviceWidth / 2.1,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  checkInButtonText: {
    color: WHITE,
    fontSize: deviceWidth / 20,
    fontWeight: '600',
  },
});

export default NoRoomBookingCheckOut;
