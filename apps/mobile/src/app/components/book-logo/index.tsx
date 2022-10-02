import React from 'react';
import Logo from './book-logo.svg';
import { StyleSheet, Text, View } from 'react-native';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { deviceWidth } from '../../utils/device';

const BookLogo: React.FC<any> = () => {
  return (
    <View style={styles.container}>
      <Logo width={deviceWidth / 8} height={deviceWidth / 8} />
      <Text style={styles.textContent}>FLRBMS</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  textContent: {
    fontSize: deviceWidth / 21,
    textTransform: 'uppercase',
    fontWeight: '600',
    color: FPT_ORANGE_COLOR,
  },
});

export default BookLogo;
