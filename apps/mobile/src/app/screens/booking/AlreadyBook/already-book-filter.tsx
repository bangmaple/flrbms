import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SearchIcon, TagIcon } from 'react-native-heroicons/outline';
import { BLACK, LIGHT_GRAY, WHITE } from '@app/constants';
import DelayInput from 'react-native-debounce-input';
import { deviceWidth } from '../../../utils/device';
import RNPickerSelect from 'react-native-picker-select';

interface AlreadyBookFilterProps {
  search: string;
  setSearch(val: string): void;
}

const AlreadyBookFilter: React.FC<AlreadyBookFilterProps> = (props) => {
  const [bookingRoomType, setBookingRoomType] = useState<string>('');

  const handleBookingRoomTypeChange = (val) => {
    setBookingRoomType(val);
  };
  return (
    <View style={[styles.filterContainer, { paddingTop: 10 }]}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
          flexGrow: 1,
        }}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <SearchIcon color={BLACK} />
          </View>
          <View style={styles.searchInput}>
            <DelayInput
              value={props.search}
              placeholder="ex: LB12"
              onChangeText={(val) => props.setSearch(val.toString())}
            />
          </View>
        </View>
        <View style={{ width: deviceWidth / 20 }} />

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              height: 50,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              backgroundColor: LIGHT_GRAY,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: deviceWidth / 8,
            }}
          >
            <TagIcon color={BLACK} />
          </View>
          <RNPickerSelect
            onValueChange={(e) => handleBookingRoomTypeChange(e.toString())}
            items={[
              {
                label: 'Booking',
                value: 'BOOKING',
              },
              {
                label: 'Booked',
                value: 'BOOKED',
              },
              {
                label: 'Checked In',
                value: 'CHECKED_IN',
              },
            ]}
            style={{
              inputAndroid: styles.searchTypeContainer,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    height: 100,
    width: deviceWidth / 1.05,
    marginTop: 10,
    backgroundColor: WHITE,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 50,
  },
  searchIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: deviceWidth / 9,
  },
  searchInput: {
    width: deviceWidth / 3,
    backgroundColor: LIGHT_GRAY,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  searchTypeContainer: {
    height: 50,
    width: deviceWidth / 3.5,
    backgroundColor: LIGHT_GRAY,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },

});

export default AlreadyBookFilter;
