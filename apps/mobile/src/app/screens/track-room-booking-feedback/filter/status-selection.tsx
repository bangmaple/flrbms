import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckIcon } from 'react-native-heroicons/outline';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import { deviceWidth } from '../../../utils/device';
import StarRating from '../../booking/checkout/rate';
import { StarIcon } from 'react-native-heroicons/solid';

const statusData = [
  {
    id: 0,
    label: 'All',
    value: undefined,
    style: { width: deviceWidth / 9 },
    slotContainerLeftStyle: { left: deviceWidth / 10 },
  },
  {
    id: 1,
    label: <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />,
    value: 1,
    style: { width: deviceWidth / 10 },
    slotContainerLeftStyle: { left: deviceWidth / 6.8 },
  },
  {
    id: 2,
    label: (
      <>
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
      </>
    ),
    value: 2,
    style: { width: deviceWidth / 8 },
    slotContainerLeftStyle: { left: deviceWidth / 3.65 },
  },
  {
    id: 3,
    label: (
      <>
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
      </>
    ),
    value: 3,
    style: { width: deviceWidth / 5.5 },
    slotContainerLeftStyle: { left: deviceWidth / 2.35 },
  },
  {
    id: 4,
    label: (
      <>
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
      </>
    ),
    value: 4,
    style: { width: deviceWidth / 4.5 },
    slotContainerLeftStyle: { left: deviceWidth / 1.59 },
  },
  {
    id: 5,
    label: (
      <>
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
        <StarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 20} />
      </>
    ),
    value: 5,
    style: { width: deviceWidth / 3.5 },
    slotContainerLeftStyle: { left: deviceWidth / 1.135 },
  },
];

interface TrackBookingRoomFilterStatusSelectionProps {
  handleSearch(): void;
  star: number[];
  setStar(val: number[]): void;
}

const TrackBookingRoomFilterStatusSelection: React.FC<
  TrackBookingRoomFilterStatusSelectionProps
> = (props) => {
  const handleSelectStatus = (statusFilter) => {
    if (
      !props.star.some((val) => statusFilter.value === val) &&
      statusFilter.value
    ) {
      props.setStar([...props.star, statusFilter.value]);
    } else if (props.star.some((val) => statusFilter.value === val)) {
      props.setStar(props.star.filter((stt) => stt !== statusFilter.value));
    } else if (!statusFilter.value) {
      props.setStar([]);
    }
  };

  const StatusCheckIcon = () => {
    return (
      <View style={[styles.selectContainer, { left: 5 }]}>
        <CheckIcon color={WHITE} size={deviceWidth / 30} />
      </View>
    );
  };

  return (
    <ScrollView showsHorizontalScrollIndicator={false} horizontal>
      <View style={styles.container}>
        {statusData.map((statusFilter) => (
          <>
            <TouchableOpacity
              onPress={() => handleSelectStatus(statusFilter)}
              key={statusFilter.id}
              style={[styles.filterTypeButton, statusFilter.style]}
            >
              <Text style={styles.filterTypeText}>{statusFilter.label}</Text>
            </TouchableOpacity>
            {props.star.some((val) => val === statusFilter.value) ? (
              <View
                style={[
                  styles.selectContainer,
                  statusFilter.slotContainerLeftStyle,
                ]}
              >
                <CheckIcon color={WHITE} size={deviceWidth / 30} />
              </View>
            ) : props.star.length < 1 ? (
              <StatusCheckIcon />
            ) : null}
          </>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },
  filterTypeButton: {
    marginLeft: 10,
    borderRadius: 8,
    height: 30,
    borderColor: FPT_ORANGE_COLOR,
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTypeText: {
    color: FPT_ORANGE_COLOR,
    fontWeight: '600',
    fontSize: deviceWidth / 30,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },

  selectContainer: {
    height: 15,
    width: 15,
    borderRadius: 50,
    backgroundColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
  },
});

export default TrackBookingRoomFilterStatusSelection;
