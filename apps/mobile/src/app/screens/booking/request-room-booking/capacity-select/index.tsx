import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deviceWidth } from '../../../../utils/device';
import { BLACK, FPT_ORANGE_COLOR, GRAY } from '@app/constants';
import React, { useState } from 'react';
import { UsersIcon } from 'react-native-heroicons/outline';
import SelectCapacityModal from './select-capacity-modal';

const CAPACITY_DATASET = [10, 20, 30, 50, 80, 100];

interface RequestRoomBookingCapacitySelectProps {
  handleSetCapacity(val: number): void;
  initialCapacity: number;
}

const RequestRoomBookingCapacitySelect: React.FC<
  RequestRoomBookingCapacitySelectProps
> = (props) => {
  const [isSelectCapacityModalShown, setSelectCapacityModalShown] =
    useState(false);
  const [selectedCapacity, setSelectedCapacity] = useState(
    props.initialCapacity
  );

  const handleSetSelectedCapacity = (val: number) => {
    setSelectedCapacity(val);
    props.handleSetCapacity(val);
    setSelectCapacityModalShown(!isSelectCapacityModalShown);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capacity</Text>
      <TouchableOpacity
        style={styles.inputSelect}
        onPress={() => setSelectCapacityModalShown(!isSelectCapacityModalShown)}
      >
        <Text
          style={styles.inputSelectText}
        >{`Up to ${selectedCapacity} people`}</Text>
        <UsersIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 16} />
      </TouchableOpacity>
      <SelectCapacityModal
        selectedCapacity={10}
        handleChoose={(val) => handleSetSelectedCapacity(val)}
        capacityData={CAPACITY_DATASET}
        isShown={isSelectCapacityModalShown}
        toggleShown={() =>
          setSelectCapacityModalShown(!isSelectCapacityModalShown)
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    color: BLACK,
    paddingBottom: 10,
  },
  inputSelect: {
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: deviceWidth / 1.22,
    paddingLeft: 10,
    height: 50,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'rgba(240, 110, 40, 0.2)',
    justifyContent: 'space-between',
  },
  inputSelectText: {
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    color: GRAY,
  },
});

export default RequestRoomBookingCapacitySelect;
