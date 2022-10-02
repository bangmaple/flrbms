import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { deviceWidth } from '../../../utils/device';
import { FPT_ORANGE_COLOR, GRAY } from '@app/constants';

const SelectFeedbackTypes: React.FC<any> = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.slotStart}>
        <View style={styles.container}>
          <Text style={styles.title}>Feedback Type</Text>
          <View style={styles.slotPicker}>
            <RNPickerSelect
              fixAndroidTouchableBug={true}
              items={props.feedbackTypesSelections}
              style={{
                inputAndroid: {
                  fontSize: deviceWidth / 25,
                  fontWeight: '600',
                  color: GRAY,
                },
                inputIOS: {
                  alignSelf: 'center',
                  fontSize: deviceWidth / 25,
                  fontWeight: '600',
                  color: GRAY,
                },
              }}
              useNativeAndroidPickerStyle={false}
              value={props.feedbackType}
              onValueChange={(value) => {
                props.handleSetFeedbackType(value);
              }}
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
    backgroundColor: '#f2f2f2',
    height: 50,
    width: deviceWidth / 1.05,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  durationButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    paddingVertical: 6,
    paddingHorizontal: 10,
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

export default React.memo(SelectFeedbackTypes);
