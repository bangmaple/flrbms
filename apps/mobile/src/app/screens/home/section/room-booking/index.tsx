import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ClipboardCopyIcon } from 'react-native-heroicons/outline';
import { deviceWidth } from '../../../../utils/device';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import { useAppNavigation } from '../../../../hooks/use-app-navigation.hook';

const HomeScreenSectionRoomBooking: React.FC<any> = () => {
  const navigate = useAppNavigation();

  const handleNavigateRoomBooking = () => {
    navigate.navigate('ROOM_BOOKING');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleNavigateRoomBooking()}
    >
      <View style={styles.wrapper}>
        <ClipboardCopyIcon size={deviceWidth / 13} color={WHITE} />
        <Text style={styles.text}>Request for room booking</Text>
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

export default HomeScreenSectionRoomBooking;
