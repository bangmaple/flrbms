import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import {
  FPT_ORANGE_COLOR,
  INPUT_GRAY_COLOR,
  WHITE,
  BLACK,
} from '@app/constants';
import NotFound from '../../../icons/empty_checkin.svg';
import { deviceHeight, deviceWidth } from '../../../utils/device';
import { HomeIcon, TicketIcon } from 'react-native-heroicons/outline';

const CheckinBookingRoomNotFound: React.FC<any> = () => {
  const navigate = useAppNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: WHITE }}>
      <View style={styles.container}>
        <>
          <NotFound
            style={{
              alignSelf: 'center',
            }}
            width={deviceWidth / 1.3}
            height={deviceHeight / 2}
          />
          <Text style={styles.text}>
            You haven't booked any room at the moment in order to check-in!
          </Text>
        </>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => navigate.replace('MAIN')}
            style={styles.backHomeButton}
          >
            <HomeIcon size={deviceWidth / 14} color={FPT_ORANGE_COLOR} />
            <Text style={styles.backHomeButtonText}>Back Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigate.replace('ROOM_BOOKING')}
            style={styles.bookNowButton}
          >
            <TicketIcon size={deviceWidth / 14} color={WHITE} />
            <Text style={styles.bookNowButtonText}>Book Now</Text>
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
    flex: 1,
    flexDirection: 'column',
  },
  text: {
    fontSize: deviceWidth / 19,
    flexWrap: 'wrap',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 10,
    color: BLACK,
  },
  footer: {
    height: 80,
    backgroundColor: WHITE,
    borderTopColor: INPUT_GRAY_COLOR,
    borderTopWidth: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  backHomeButton: {
    display: 'flex',
    borderRadius: 8,
    borderColor: FPT_ORANGE_COLOR,
    borderWidth: 2,
    width: deviceWidth / 2.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 50,
  },
  backHomeButtonText: {
    color: FPT_ORANGE_COLOR,
    fontSize: deviceWidth / 19,
    fontWeight: '500',
  },
  bookNowButton: {
    display: 'flex',
    borderRadius: 8,
    backgroundColor: FPT_ORANGE_COLOR,
    width: deviceWidth / 2.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 50,
  },
  bookNowButtonText: {
    color: WHITE,
    fontSize: deviceWidth / 19,
    fontWeight: '500',
  },
});

export default CheckinBookingRoomNotFound;
