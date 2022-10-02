import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { deviceHeight, deviceWidth } from '../../../utils/device';
import { BLACK, FPT_ORANGE_COLOR } from '@app/constants';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { boxShadow } from '../../../utils/box-shadow.util';
import { HeartIcon } from 'react-native-heroicons/solid';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';

const RequestRoomBookingHeader: React.FC<any> = () => {
  const navigate = useAppNavigation();

  return (
    <>
      <Image
        style={styles.image}
        source={require('../../../../../assets/library/tv4.jpeg')}
      />
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigate.pop()}>
          <ChevronLeftIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 14} />
        </TouchableOpacity>
        <Text style={[styles.titleText, boxShadow(styles)]}>
          Request for room booking
        </Text>
        <View></View>

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    top: 0,
    left: 0,
    position: 'absolute',
    height: 210,
    backgroundColor: BLACK,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: Platform.OS === 'android' ? 20 : 5,
  },
  titleText: {
    fontSize: deviceWidth / 21,
    fontWeight: '600',
    color: BLACK,
  },
});

export default RequestRoomBookingHeader;
