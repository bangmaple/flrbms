import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ClipboardIcon } from 'react-native-heroicons/outline';
import { deviceWidth } from '../../../../utils/device';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import { useAppNavigation } from '../../../../hooks/use-app-navigation.hook';
import { useAppDispatch } from '../../../../hooks/use-app-dispatch.hook';
import { fetchCurrentCheckinInformation } from '../../../../redux/features/room-booking/thunk/fetch-current-checkin-information.thunk';

const HomeScreenSectionRoomCheckin: React.FC<any> = () => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  const handleNavigateTrackBookingRoom = () => {
    dispatch(fetchCurrentCheckinInformation())
      .unwrap()
      .then((value) => {
        if (typeof value === "object"){
          navigate.navigate('CHECK_IN')
        } else {
          navigate.navigate('CHECK_IN_NOT_FOUND')
        }

      })
      .catch(() => alert('Failed to fetch check-in information'));
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleNavigateTrackBookingRoom()}
    >
      <View style={styles.wrapper}>
        <ClipboardIcon size={deviceWidth / 13} color={WHITE} />
        <Text style={styles.text}>Check-in booking room</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: deviceWidth / 2 - 30,
    backgroundColor: FPT_ORANGE_COLOR,
    margin: 5,
    borderRadius: 8,
  },
  wrapper: {
    margin: 10,
  },
  text: {
    marginTop: 10,
    fontSize: Platform.OS === 'android' ? 14 : 16,
    fontWeight: '600',
    color: WHITE,
  },
});

export default HomeScreenSectionRoomCheckin;
