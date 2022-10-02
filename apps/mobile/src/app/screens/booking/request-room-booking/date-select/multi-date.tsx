import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CheckIcon } from 'react-native-heroicons/solid';
import { BLACK, FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import { deviceWidth } from '../../../../utils/device';

interface DateSelectMultiDateCheckboxProps {
  handleCheck(): void;
  isChecked: boolean;
}

const DateSelectMultiDateCheckbox: React.FC<
  DateSelectMultiDateCheckboxProps
> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multi-date</Text>
      <View style={styles.checkboxContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: deviceWidth / 26,
    fontWeight: '600',
    marginBottom: 6,
    color: BLACK,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBox: {
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
});

export default DateSelectMultiDateCheckbox;
