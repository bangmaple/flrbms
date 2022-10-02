import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ChartPieIcon,
  ChevronRightIcon,
  ClockIcon,
} from 'react-native-heroicons/outline';
import { deviceWidth } from '../../../utils/device';
import { BLACK, GRAY, LIGHT_GRAY, WHITE } from '@app/constants';
import RNPickerSelect from 'react-native-picker-select';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';

interface SelectDurationProps {
  handleSetSlotStart(val: string): void;
  handleSetSlotEnd(val: string): void;
  slotStart: string;
  slotEnd: string;
  slotSelections: any[];
}

const SelectDuration: React.FC<SelectDurationProps> = (props) => {
  const dispatch = useAppDispatch();

  const slots = useAppSelector((state) => state.slot.slots);
  const [bookTimeDetail, setBookTimeDetail] = useState<string>();

  const findSlotById = (id: string) => {
    return slots.filter((slot) => slot.id === id)[0];
  };

  useEffect(() => {
    if (props.slotStart && props.slotEnd) {
      const slotStart = findSlotById(props.slotStart);
      const slotEnd = findSlotById(props.slotEnd);
      if (slotStart.timeStart > slotEnd.timeEnd) {
        props.handleSetSlotStart(slotEnd.id);
        props.handleSetSlotEnd(slotStart.id);
      }
      setBookTimeDetail(`${slotStart.timeStart} - ${slotEnd.timeEnd}`);
    }
  }, [props.slotStart, props.slotEnd]);

  return (
    <View style={styles.durationContainer}>
      <View style={styles.durationTitleContainer}>
        <Text style={styles.durationTitle}>Select a duration</Text>
      </View>
      <View style={styles.filterDurationContainer}>
        <View style={styles.durationTimeContainer}>
          <View style={styles.durationTimeBetweenContainer}>
            <View style={styles.iconDurationContainer}>
              <ChartPieIcon size={deviceWidth / 15} color={BLACK} />
            </View>
            <View style={styles.slotPicker}>
              <RNPickerSelect
                fixAndroidTouchableBug={true}
                items={props.slotSelections}
                style={{
                  inputAndroid: {
                    fontSize: deviceWidth / 21,
                    fontWeight: '600',
                    color: GRAY,
                  },
                  inputIOS: {
                    alignSelf: 'center',
                    fontSize: deviceWidth / 21,
                    fontWeight: '600',
                    color: GRAY,
                  },
                }}
                useNativeAndroidPickerStyle={false}
                value={props.slotStart}
                onValueChange={(value) => props.handleSetSlotStart(value)}
              />
            </View>
            <ChevronRightIcon color={BLACK} />
            <View style={styles.slotPicker}>
              <RNPickerSelect
                fixAndroidTouchableBug={true}
                items={props.slotSelections}
                style={{
                  inputAndroid: {
                    fontSize: deviceWidth / 21,
                    fontWeight: '600',
                    color: GRAY,
                  },
                  inputIOS: {
                    alignSelf: 'center',
                    fontSize: deviceWidth / 21,
                    fontWeight: '600',
                    color: GRAY,
                  },
                }}
                useNativeAndroidPickerStyle={false}
                value={props.slotEnd}
                onValueChange={(value) => props.handleSetSlotEnd(value)}
              />
            </View>
          </View>
          <View style={styles.bookTimeContainer}>
            <View style={styles.iconDurationContainer}>
              <ClockIcon size={deviceWidth / 15} color={BLACK} />
            </View>
            <View style={styles.bookTimeDetailContainer}>
              <Text style={styles.bookTimeDetailText}>{bookTimeDetail}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterDurationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  durationContainer: {
    marginTop: 20,
    height: 180,
    backgroundColor: WHITE,
  },
  durationTitleContainer: {
    margin: 10,
  },
  durationTitle: {
    color: '#808080',
    fontSize: 20,
  },
  durationTimeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationTimeBetweenContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotPicker: {
    margin: 5,
    backgroundColor: '#f2f2f2',
    height: 50,
    width: deviceWidth / 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  durationButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  durationSlotButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  durationSlotButton: {
    margin: 5,
    backgroundColor: '#f2f2f2',
    height: 50,
    width: deviceWidth / 1.3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  durationSlotContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchDurationButton: {
    height: deviceWidth / 8,
    width: deviceWidth / 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookTimeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDurationContainer: {
    height: 50,
    width: 50,
    borderRadius: 8,
    backgroundColor: LIGHT_GRAY,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookTimeDetailText: {
    fontSize: deviceWidth / 21,
    fontWeight: '600',
    color: GRAY,
  },
  bookTimeDetailContainer: {
    margin: 5,
    backgroundColor: LIGHT_GRAY,
    height: 50,
    width: deviceWidth / 1.33,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});

export default React.memo(SelectDuration);
