import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select';
import { deviceWidth } from '../../../../utils/device';
import { BLACK, GRAY } from '@app/constants';
import SlotSelectMultiSlot from './multi-slot';

interface SelectSlotsProps {
  slotSelections: any[];
  slotStart: number;
  slotEnd: number;
  handleChangeSlotEnd(val: number): void;
  handleChangeSlotStart(val: number): void;
  isChecked: boolean;
  handleCheck(): void;
}

const filterSlotStartAndSlotEnd = (
  slotSelections,
  slotStartId,
  slotEndId,
  isChecked
) => {
  let slotEndSelectionsArray = [];
  let slotStartSelectionsArray = [];
  let slotEndNum = 1;
  let slotStartNum = 1;

  if (slotStartId) {
    slotStartNum = slotSelections.find(
      (slot) => slot.value === slotStartId
    ).slotNum;
  } else {
    slotStartNum = 1
  }

  if (slotEndId) {
    slotEndNum = slotSelections.find(
      (slot) => slot.value === slotEndId
    ).slotNum;
  } else {
    slotEndNum = 1;
  }

  if (isChecked) {
    slotEndSelectionsArray = slotSelections.filter(
      (slot) => {
        return slot.slotNum >= slotStartNum
      }
    );
    slotStartSelectionsArray = slotSelections.filter(
      (slot) => {
       return  slot.slotNum <= slotEndNum
      }
    );
    return [slotStartSelectionsArray, slotEndSelectionsArray];
  } else {
    slotStartSelectionsArray = slotSelections;
    slotEndSelectionsArray = slotSelections
    return [slotStartSelectionsArray, slotEndSelectionsArray];
  }
};

const SlotSelect: React.FC<SelectSlotsProps> = (props) => {
  const [slotStartSelections, setSlotStartSelections] = useState(
    props.slotSelections
  );
  const [slotEndSelections, setSlotEndSelections] = useState(
    props.slotSelections
  );

  useEffect(() => {
    const result = filterSlotStartAndSlotEnd(props.slotSelections, props.slotStart, props.slotEnd, props.isChecked)
    setSlotStartSelections(result[0])
    setSlotEndSelections(result[1])
  }, [props.isChecked, props.slotEnd, props.slotStart]);

  return (
    <View style={styles.container}>
      <View style={styles.slotStart}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {props.isChecked ? 'From Slot' : 'Slot'}
          </Text>
          <View style={styles.slotPicker}>
            <RNPickerSelect
              placeholder={{}}
              fixAndroidTouchableBug={true}
              items={slotStartSelections}
              style={pickerStyles}
              useNativeAndroidPickerStyle={false}
              value={props.slotStart || slotStartSelections[0]}
              onValueChange={(value) => {
                props.handleChangeSlotStart(value);
              }}
            />
          </View>
        </View>
        <SlotSelectMultiSlot
          isChecked={props.isChecked}
          handleCheck={() => props.handleCheck()}
        />
      </View>
      {props.isChecked ? (
        <View style={styles.container}>
          <Text style={styles.title}>To Slot</Text>

          <View style={[styles.slotPicker, { width: deviceWidth / 1.2 }]}>
            <RNPickerSelect
              placeholder={{}}
              fixAndroidTouchableBug={true}
              items={slotEndSelections}
              style={pickerStyles}
              useNativeAndroidPickerStyle={false}
              value={props.slotEnd || slotEndSelections[0]}
              onValueChange={(value) => {
                props.handleChangeSlotEnd(value);
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const pickerStyles: PickerStyle = {
  inputAndroid: {
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    color: GRAY,
    alignSelf: 'center',
  },
  inputIOS: {
    alignSelf: 'center',
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    color: GRAY,
  },
};

const styles = StyleSheet.create({
  slotStart: {
    display: 'flex',
    flexDirection: 'row',
  },
  slotPicker: {
    width: deviceWidth / 1.5,
    height: 50,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'rgba(240, 110, 40, 0.2)',
    justifyContent: 'center',
  },
  durationButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    marginBottom: 6,
    color: BLACK
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default React.memo(SlotSelect);
