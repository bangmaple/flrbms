import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import { CheckIcon } from 'react-native-heroicons/outline';

interface SeachTypeCheckBadge {
  width: number;
  height: number;
}

const SearchTypeCheckBadge: React.FC<SeachTypeCheckBadge> = (props) => {
  return (
    <View
      style={{
        ...styles.container,
        marginLeft: props.width,
        marginTop: props.height,
      }}
    >
      <CheckIcon color={WHITE} size={12} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    borderRadius: 50,
    backgroundColor: FPT_ORANGE_COLOR,
  },
});

export default SearchTypeCheckBadge;
