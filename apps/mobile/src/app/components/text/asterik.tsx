import React from 'react';
import { Text, View } from 'react-native';
import { deviceWidth } from '../../utils/device';

const Asterik = () => {
  return (
    <View style={{ marginTop: -2 }}>
      <Text style={{ color: 'red', fontSize: deviceWidth / 25 }}>*</Text>
    </View>
  );
};

export default Asterik;
