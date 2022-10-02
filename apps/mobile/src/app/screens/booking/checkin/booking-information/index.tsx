import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Divider from '../../../../components/text/divider';
import {deviceWidth} from '../../../../utils/device';
import dayjs from 'dayjs';
import {BLACK, FPT_ORANGE_COLOR, GRAY, INPUT_GRAY_COLOR,} from '@app/constants';
import {ChevronRightIcon} from 'react-native-heroicons/outline';
import {useAppNavigation} from '../../../../hooks/use-app-navigation.hook';
import {useAppSelector} from '../../../../hooks/use-app-selector.hook';
import {
  fetchDeviceInUseByBookingRequestId
} from "../../../../redux/features/room-booking/thunk/fetch-devices-in-use-by-booking-request-id.thunk";
import {useAppDispatch} from "../../../../hooks/use-app-dispatch.hook";
import {fetchAllSlots} from "../../../../redux/features/slot";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ReadyToCheckinBookingInformationProps {}

const ReadyToCheckinBookingInformation: React.FC<
  ReadyToCheckinBookingInformationProps
> = (props) => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch()
  const slots = useAppSelector((state) => state.slot.slots);
  const { currentCheckinInformation } = useAppSelector(
    (state) => state.roomBooking
  );
  const [timeSlotCheckin, setTimeSlotCheckin] = useState('')
  const [timeSlotCheckout, setTimeSlotCheckout] = useState('')

  useEffect(() => {
    dispatch(fetchAllSlots()).unwrap().then((value) => {
      setTimeSlotCheckin(value
        .find((slot) => slot.slotNum === currentCheckinInformation.checkinSlot)
        .timeStart.slice(0, 5))
      setTimeSlotCheckout(value
        .find((slot) => slot.slotNum === currentCheckinInformation.checkoutSlot)
        .timeEnd.slice(0, 5))    })
  }, [])

  const handleViewDevices = (id) => {
    dispatch(fetchDeviceInUseByBookingRequestId(id))
      .unwrap()
      .then((val) => {
        navigate.navigate('ACCEPT_BOOKING_LIST_DEVICES');
      });
  };

  return (
    <>
      <Text style={styles.informationHeaderTitle}>BOOKING INFORMATION</Text>
      <View style={styles.bookingInformationContainer}>
        <View style={styles.dataRowContainer}>
          <Text style={styles.titleText}>Requested By</Text>
          <Text style={styles.valueText}>
            {currentCheckinInformation.requestedBy}
          </Text>
        </View>
        <Divider num={deviceWidth / 10} />
        <View style={styles.dataRowContainer}>
          <Text style={styles.titleText}>Library Room</Text>
          <Text style={styles.valueText}>
            {currentCheckinInformation.roomName}
          </Text>
        </View>
        <Divider num={deviceWidth / 10} />

        <View style={styles.dataRowContainer}>
          <Text style={styles.titleText}>Check-in Date</Text>
          <Text style={styles.valueText}>
            {dayjs(new Date(currentCheckinInformation.checkinDate)).format(
              'DD/MM/YYYY'
            )}
          </Text>
        </View>


        <Divider num={deviceWidth / 10} />

        <View style={styles.dataRowContainer}>
          <Text style={styles.titleText}>Check-in Time</Text>
          <Text style={styles.valueText}>
            {currentCheckinInformation.checkinTime.slice(0,5)}
          </Text>
        </View>


        <Divider num={deviceWidth / 10} />

        <View style={styles.dataRowContainer}>
          <Text style={styles.titleText}>Check-out Time</Text>
          <Text style={styles.valueText}>
            {currentCheckinInformation.checkoutTime.slice(0,5)}
          </Text>
        </View>

        <Divider num={deviceWidth / 10} />

        <View style={styles.dataRowContainer}>
          <Text style={styles.titleText}>Requested devices</Text>
          <TouchableOpacity
            onPress={() => handleViewDevices(currentCheckinInformation.id)}
            style={styles.viewDevicesContainer}
          >
            <Text style={styles.viewDevicesText}>View devices</Text>
            <ChevronRightIcon
              color={FPT_ORANGE_COLOR}
              size={deviceWidth / 14}
            />
          </TouchableOpacity>
        </View>

        <Divider num={deviceWidth / 10} />

        <View style={styles.dataRowContainer}>
          <Text style={styles.titleText}>Booking Reason</Text>
          <Text style={styles.valueText}>
            {currentCheckinInformation.bookingReason}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  informationHeaderTitle: {
    marginTop: 20,
    color: GRAY,
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    marginLeft: 20,
  },
  bookingInformationContainer: {
    marginTop: 10,
    display: 'flex',
    width: deviceWidth / 1.1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: INPUT_GRAY_COLOR,
    alignSelf: 'center',
  },
  dataRowContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    flexWrap: 'wrap',
  },
  titleText: {
    color: GRAY,
    fontWeight: '400',
    fontSize: deviceWidth / 23,
  },
  valueText: {
    color: BLACK,
    fontSize: deviceWidth / 23,
    fontWeight: '500',
  },

  viewDevicesContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDevicesText: {
    color: FPT_ORANGE_COLOR,
    fontSize: deviceWidth / 23,
    fontWeight: '500',
  },
});

export default ReadyToCheckinBookingInformation;
