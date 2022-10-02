import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { deviceWidth } from '../../../utils/device';
import { FPT_ORANGE_COLOR, GRAY } from '@app/constants';

const SelectSlots: React.FC<any> = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.slotStart}>
        <View style={styles.container}>
          <Text style={styles.title}>Booking Reason</Text>
          <View style={styles.slotPicker}>
            <RNPickerSelect
              items={props.bookingReasonSelections}
              style={{
                inputAndroid: {
                  fontSize: deviceWidth / 23,
                  fontWeight: '600',
                  color: GRAY,
                },
                inputIOS: {
                  alignSelf: 'center',
                  fontSize: deviceWidth / 23,
                  fontWeight: '600',
                  color: GRAY,
                },
              }}
              useNativeAndroidPickerStyle={true}
              value={props.bookingReason}
              onValueChange={props.handleSetBookingRoomReason}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  slotStart: {
    display: 'flex',
    flexDirection: 'row',
  },
  slotPicker: {
    margin: 5,
    backgroundColor: '#f2f2f2',
    height: 50,
    width: deviceWidth / 1.15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  durationButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: deviceWidth / 26,
    fontWeight: '500',
    marginBottom: 5,
  },
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

export default SelectSlots;
