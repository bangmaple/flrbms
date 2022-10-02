import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChatAlt2Icon,
  InboxIcon,
  InboxInIcon,
} from 'react-native-heroicons/outline';
import { deviceWidth } from '../../../../utils/device';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import { useAppNavigation } from '../../../../hooks/use-app-navigation.hook';

const HomeScreenSectionTrackRoomBookingFeedback: React.FC<any> = () => {
  const navigate = useAppNavigation();

  const handleNavigateTrackBookingRoom = () => {
    navigate.navigate('TRACK_ROOM_BOOKING_FEEDBACK');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleNavigateTrackBookingRoom()}
    >
      <View style={styles.wrapper}>
        <InboxIcon size={deviceWidth / 13} color={WHITE} />
        <Text style={styles.text}>Track room booking feedbacks</Text>
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

export default HomeScreenSectionTrackRoomBookingFeedback;
