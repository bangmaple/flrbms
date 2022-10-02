import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  SearchIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from 'react-native-heroicons/outline';
import { BLACK, GRAY, LIGHT_GRAY, WHITE } from '@app/constants';
import { deviceWidth } from '../../../utils/device';
import DelayInput from 'react-native-debounce-input';
import RNPickerSelect from 'react-native-picker-select';

interface ChooseRoomBookingHeaderProps {
  roomName: string;
  setRoomName(val: string): void;
  roomType: string;
  setRoomType(val: string): void;
  sortRoomName: string;
  sortRoomType: string;
  setSortRoomName(val: string): void;
  setSortRoomType(val: string): void;
}

const roomTypeData = [
  {
    label: 'All',
    value: ''
  },
  {
    label: 'Library Room',
    value: 'Library Room'
  },
  {
    label: 'Library Hall',
    value: 'Library Hall'
  },
  {
    label: 'Seminar Room',
    value: 'Seminar Room'
  }
];

const ChooseRoomBookingHeader: React.FC<ChooseRoomBookingHeaderProps> = (props) => {

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitleText}>
        FILTER
      </Text>
      <View style={styles.filterContainer}>
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchIconContainer}>
            <SearchIcon color={BLACK} size={deviceWidth / 18}/>
          </View>
          <DelayInput
            minLength={0}
            placeholder="By name..."
            onChangeText={(val) => props.setRoomName(val.toString())}
            style={styles.searchInput}/>
          {props.sortRoomName === "ASC"
            ? <TouchableOpacity
              onPress={() => props.setSortRoomName("DESC")}
              style={styles.typeSortContainer}>
              <SortAscendingIcon
                color={BLACK}
                size={deviceWidth / 18}/>
            </TouchableOpacity>
            : <TouchableOpacity
              onPress={() => props.setSortRoomName("ASC")}
              style={styles.typeSortContainer}>
              <SortDescendingIcon
                color={BLACK}
                size={deviceWidth / 18}/>
            </TouchableOpacity>}
        </View>

        <View style={styles.typeContainer}>
          <View style={styles.typeInputContainer}>
            <RNPickerSelect
              style={{
                inputAndroid: {
                  width: deviceWidth / 2.4,
                }
              }}
              onValueChange={(val) => props.setRoomType(val)}
              items={roomTypeData}
            />
          </View>
          {props.sortRoomType === "ASC"
          ? <TouchableOpacity
              onPress={() => props.setSortRoomType("DESC")}
              style={styles.typeSortContainer}>
              <SortAscendingIcon
                color={BLACK}
                size={deviceWidth / 18}/>
            </TouchableOpacity>
          : <TouchableOpacity
              onPress={() => props.setSortRoomType("ASC")}
              style={styles.typeSortContainer}>
              <SortDescendingIcon
                color={BLACK}
                size={deviceWidth / 18}/>
            </TouchableOpacity>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  headerContainer: {
    marginTop: 10
  },

  headerTitleText: {
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    color: GRAY
  },

  filterContainer: {
    display: 'flex',
    width: deviceWidth / 1.05,
    height: 60,
    backgroundColor: WHITE,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  searchFilterContainer: {
    display: 'flex',
    flexDirection: 'row'
  },

  searchIconContainer: {
    width: 40,
    height: 40,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: LIGHT_GRAY,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  searchInput: {
    height: 40,
    width: deviceWidth / 5.5,
    backgroundColor: LIGHT_GRAY,
  },

  searchSortContainer: {
    height: 40,
    width: 40,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY
  },
  typeContainer: {
    display: 'flex',
    flexDirection: 'row'

  },
  typeInputContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: LIGHT_GRAY,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  typeSortContainer: {
    height: 40,
    width: 40,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY
  },
});

export default ChooseRoomBookingHeader;
