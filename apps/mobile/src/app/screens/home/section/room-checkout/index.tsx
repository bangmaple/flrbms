import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ClipboardCheckIcon } from 'react-native-heroicons/outline';
import { deviceWidth } from '../../../../utils/device';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import { useAppNavigation } from '../../../../hooks/use-app-navigation.hook';
import { fetchCurrentCheckoutInformation } from '../../../../redux/features/room-booking/thunk/fetch-current-checkout-information.thunk';
import { useAppDispatch } from '../../../../hooks/use-app-dispatch.hook';

const HomeScreenSectionRoomCheckout: React.FC<any> = () => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  const handleNavigateRoomCheckout = () => {
    dispatch(fetchCurrentCheckoutInformation())
      .unwrap()
      .then(() => navigate.navigate('ROOM_CHECKOUT'))
      .catch(() => navigate.navigate('NO_ROOM_CHECKOUT'));
  };

  return (
    <TouchableOpacity
      onPress={() => handleNavigateRoomCheckout()}
      style={styles.container}
    >
      <View style={styles.wrapper}>
        <ClipboardCheckIcon size={deviceWidth / 13} color={WHITE} />
        <Text style={styles.text}>Check-out booking room</Text>
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

export default HomeScreenSectionRoomCheckout;
