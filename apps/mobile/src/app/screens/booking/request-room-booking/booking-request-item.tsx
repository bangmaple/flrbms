import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {deviceWidth} from "../../../utils/device";
import {BLACK, FPT_ORANGE_COLOR, GRAY, WHITE} from "@app/constants";
import {DeviceTabletIcon, LibraryIcon, MinusIcon, PlusIcon} from "react-native-heroicons/outline";
import {handleSetProvidedDevices, updateBookingRequestId} from "../../../redux/features/room-booking-v2/slice";
import {useAppNavigation} from "../../../hooks/use-app-navigation.hook";
import {useAppDispatch} from "../../../hooks/use-app-dispatch.hook";
import {useAppSelector} from "../../../hooks/use-app-selector.hook";

interface BookingRequest {
  id: number;
  capacity: number;
  date: string;
  timeStart: string;
  timeEnd: string;
  devices?: {id: string; quantity: number}[];
}

interface BookingRequestItemProps {
  request: BookingRequest;
  handleRemoveBookingRequest(val: number): void;
  handleSetDevices(requestId: number, devices: {id: string; quantity: number}[]): void;
  setDeviceSelectRequestId(val: number): void;
}

const BookingRequestItem: React.FC<BookingRequestItemProps> = (props) => {

  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  const RemoveBookingRequestSection = () => {
    return (
      <TouchableOpacity
        style={styles.removeBookingRequestContainer}
        onPress={() => props.handleRemoveBookingRequest(props.request.id)}>
        <MinusIcon color={WHITE} size={deviceWidth / 23} />
      </TouchableOpacity>
    )
  };

  const devices = useAppSelector((state) => state.bookedRequest.providedDevices);

  useEffect(() => {
    navigate.addListener('focus', () => {
      if (devices) {
        props.handleSetDevices(props.request.id, devices);
        dispatch(handleSetProvidedDevices(undefined));
      }
    })
  });


  const ChooseDeviceSection = () => {
    return (
        <View>
          <TouchableOpacity
            onPress={() => {
              props.setDeviceSelectRequestId(props.request.id);
            }}
            style={styles.chooseDeviceSectionContainer}
          >
            <DeviceTabletIcon
              color={FPT_ORANGE_COLOR}
              size={deviceWidth / 16}
            />
          </TouchableOpacity>
          <View
            style={styles.chooseDeviceSectionButton}
          >
            <PlusIcon color={WHITE} size={deviceWidth / 26} />
          </View>
        </View>
    );
  }

  const BookingRequestIcon = () => {
    return (          <View
      style={{
        borderRadius: 50,
        borderWidth: 2,
        borderColor: FPT_ORANGE_COLOR,
        width: 50,
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LibraryIcon
        color={FPT_ORANGE_COLOR}
        size={deviceWidth / 16}
      />
    </View>);
  }

  return (
    <View
      key={props.request.id}
      style={styles.container}
    >
      <RemoveBookingRequestSection/>
      <ChooseDeviceSection/>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 10,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <BookingRequestIcon/>
          <View
            style={styles.itemContainer}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Text
                style={styles.requestTitle}
              >
                Date:{' '}
              </Text>
              <Text
                style={styles.requestValue}
              >
                {props.request.date}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Text
                style={styles.requestTitle}
              >
                Check-in:{' '}
              </Text>
              <Text
                style={styles.requestValue}
              >
                {props.request.timeStart}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Text
                style={styles.requestTitle}
              >
                Check-out:{' '}
              </Text>
              <Text
                style={styles.requestValue}
              >
                {props.request.timeEnd}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Text
                style={styles.requestTitle}
              >
                Capacity:{' '}
              </Text>
              <Text
                style={styles.requestValue}
              >
                {props.request.capacity}
              </Text>
            </View>
          </View>
        </View>
        <View></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 115,
    width: deviceWidth / 1.1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    marginTop: 10,
    elevation: 7,
    backgroundColor: WHITE,
    borderRadius: 8,
  },

  removeBookingRequestContainer: {
    position: 'absolute',
    right: -10,
    top: -10,
    height: 25,
    width: 25,
    borderRadius: 50,
    backgroundColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    height: 110,
    paddingLeft: 10,
  },
  chooseDeviceSectionContainer: {
    position: 'absolute',
    right: 10,
    top: 40,
    height: 40,
    width: 40,
    borderRadius: 6,
    borderColor: FPT_ORANGE_COLOR,
    borderWidth: 2,
    backgroundColor: WHITE,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chooseDeviceSectionButton: {
    position: 'absolute',
    right: 3,
    top: 31,
    height: 20,
    width: 20,
    borderRadius: 50,
    backgroundColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestTitle: {
    color: GRAY,
    fontSize: deviceWidth / 23,
    fontWeight: '500',
  },
  requestValue: {
    color: BLACK,
    fontSize: deviceWidth / 23,
    fontWeight: '500',
  }
});

export default BookingRequestItem;
