import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deviceWidth } from '../../../../utils/device';
import { CheckIcon } from 'react-native-heroicons/solid';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';

interface SlotSelectMultiSlotProps {
  isChecked: boolean;
  handleCheck(): void;
}

const SlotSelectMultiSlot: React.FC<SlotSelectMultiSlotProps> = (props) => {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: deviceWidth / 26,
          fontWeight: '500',
          marginBottom: 16,
        }}
      >
        Multi Slot
      </Text>
      <TouchableOpacity
        style={styles.checkBox}
        onPress={() => props.handleCheck()}
      >
        {props.isChecked ? (
          <CheckIcon color={FPT_ORANGE_COLOR} />
        ) : (
          <CheckIcon color={WHITE} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  checkBox: {
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
  },
});

export default SlotSelectMultiSlot;
