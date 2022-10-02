import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SearchIcon, SortAscendingIcon} from "react-native-heroicons/solid";
import {BLACK, LIGHT_GRAY, WHITE} from "@app/constants";
import DelayInput from "react-native-debounce-input";
import {SortDescendingIcon} from "react-native-heroicons/outline";
import {deviceWidth} from "../../../../utils/device";

interface DeviceSelectFilterProps {
  search: string;
  setSearch(val: string): void;
  sort: string;
  setSort(val: string): void;
}

const DeviceSelectFilter: React.FC<DeviceSelectFilterProps> = (props) => {

    return (
      <View style={styles.filterContainer}>
        <Text style={styles.filterHeaderText}>FILTERING</Text>
        <View style={styles.filterBodyContainer}>
          <View style={styles.filterInputContainer}>
            <View style={styles.filterInputIconContainer}>
              <SearchIcon color={BLACK} />
            </View>
            <View style={styles.filterInput}>
              <DelayInput
                style={{
                  height: 50,
                }}
                delayTimeout={400}
                minLength={0}
                maxLength={50}
                value={props.search}
                onChangeText={(text) => props.setSearch(text.toString())}
                placeholder="Search for devices by name..."
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => (props.sort === 'ASC' ? props.setSort('DESC') : props.setSort('ASC'))}
            style={styles.filterSortButton}
          >
            {props.sort === 'ASC' ? (
              <SortAscendingIcon color={BLACK} />
            ) : (
              <SortDescendingIcon color={BLACK} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );

}

const styles =StyleSheet.create({
  filterContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
    backgroundColor: WHITE,
    height: 100,
    borderRadius: 8,
  },
  filterHeaderText: {
    color: BLACK,
    fontSize: deviceWidth / 25,
    fontWeight: '600',
    paddingTop: 6,
    paddingHorizontal: 10,
  },
  filterBodyContainer: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterInputContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  filterInputIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: LIGHT_GRAY,
  },
  filterInput: {
    backgroundColor: LIGHT_GRAY,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    height: 50,
    width: deviceWidth / 1.6,
  },
  filterSortButton: {
    width: 50,
    height: 50,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeviceSelectFilter;
