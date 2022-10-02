import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const renderDividerText = (num: number) => {
  let result = '';
  for (let i = 0; i < num; i++) {
    result += '_';
  }
  return result;
};

interface DividerProps {
  num: number;
};

const Divider = ({num}: DividerProps )=> {


  return (
    <View style={[styles.dividerContainer]}>
      <Text style={[styles.dividerText]}>
        {renderDividerText(num)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dividerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerText: {
    color: 'rgba(209, 209, 209, 1)'
  },
});

export default Divider;
