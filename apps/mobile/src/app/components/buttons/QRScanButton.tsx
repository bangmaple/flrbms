import { StyleSheet, View } from 'react-native';
import { QrcodeIcon } from 'react-native-heroicons/solid';
import React from 'react';
import { FPT_ORANGE_COLOR } from '@app/constants';

const QRScanButton = () => {
  return (
    <View style={[styles.container]}>
      <QrcodeIcon color="#fff" size={50} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 50,
    width: 65,
    height: 65,
    borderColor: 'rgba(209, 209, 209, 1)',
  },
});

export default QRScanButton;
