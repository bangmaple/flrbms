import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import { BLACK, FPT_ORANGE_COLOR, GRAY, WHITE } from '@app/constants';
import { deviceHeight, deviceWidth } from '../../../utils/device';
import {
  ChevronDoubleRightIcon,
  DeviceMobileIcon,
  ExclamationCircleIcon,
  LibraryIcon,
} from 'react-native-heroicons/outline';
import Divider from '../../../components/text/divider';
import QRCode from 'react-native-qrcode-svg';
import AlertModal from '../../../components/modals/alert-modal.component';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import dayjs from 'dayjs';
import { checkOutBookingRoom } from '../../../redux/features/room-booking/thunk/checkout-booking-room.thunk';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';
import { fetchAllSlots } from '../../../redux/features/slot';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import { API_IP } from '../../../constants/constant';

const RoomBookingReadyToCheckOut: React.FC<any> = () => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  const scrollView = useRef<ScrollView>(null);

  const { roomBookingCheckout } = useAppSelector((state) => state.roomBooking);

  const [isErrorModalShown, setErrorModalShown] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('Error');
  const [timeSlotCheckin, setTimeSlotCheckin] = useState('');
  const [timeSlotCheckout, setTimeSlotCheckout] = useState('');
  const [isCheckOutSuccessModalShown, setCheckOutSuccessModalShown] =
    useState(false);

  const socket = useMemo(() => {
    return SocketIOClient(`http://${API_IP}:5000/booking`, {
      jsonp: false,
      transports: ['websocket'],
    });
  }, []);

  useEffect(() => {
    socket.on('msgToServer', (e) => {
      if (e === roomBookingCheckout.id) {
        setCheckOutSuccessModalShown(!isCheckOutSuccessModalShown);
      }
    });
  });

  useEffect(() => {
    dispatch(fetchAllSlots())
      .unwrap()
      .then((value) => {
        setTimeSlotCheckin(
          value
            .find((slot) => slot.slotNum === roomBookingCheckout.checkinSlot)
            .timeStart.slice(0, 5)
        );
        setTimeSlotCheckout(
          value
            .find((slot) => slot.slotNum === roomBookingCheckout.checkoutSlot)
            .timeEnd.slice(0, 5)
        );
      });
  }, []);

  const handleCheckoutBookingRoom = () => {
    dispatch(checkOutBookingRoom(roomBookingCheckout.id))
      .unwrap()
      .then(() => navigate.navigate('CHECKOUT_SUCCESSFULLY'))
      .catch((e) => alert('Failed while checking out booking room'));
  };

  const GenericAlertModal = () => {
    return (
      <AlertModal
        isOpened={isCheckOutSuccessModalShown}
        height={180}
        width={deviceWidth / 1.1}
        toggleShown={() =>
          setTimeout(() => {
            navigate.navigate('CHECKOUT_SUCCESSFULLY');
          }, 1)
        }
      >
        <View
          style={{
            display: 'flex',
            flex: 1,
            flexGrow: 0.9,
            justifyContent: 'space-between',
            paddingHorizontal: 10,
          }}
        >
          <ExclamationCircleIcon
            style={{
              alignSelf: 'center',
            }}
            size={deviceWidth / 8}
            color={FPT_ORANGE_COLOR}
          />
          <Text
            style={{
              color: BLACK,
              fontWeight: '500',
              fontSize: deviceWidth / 23,
              textAlign: 'center',
            }}
          >
            You have successfully checked-out!
          </Text>
          <TouchableOpacity
            onPress={() => {
              setCheckOutSuccessModalShown(!isCheckOutSuccessModalShown);
              setTimeout(() => {
                navigate.navigate('CHECKOUT_SUCCESSFULLY');
              }, 1);
            }}
            style={{
              backgroundColor: FPT_ORANGE_COLOR,
              height: 40,
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontWeight: '500',
                fontSize: deviceWidth / 23,
                color: WHITE,
              }}
            >
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </AlertModal>
    );
  };

  const renderDevice = (device) => {
    return (
      <View style={styles.deviceDetailWrapper}>
        <View style={styles.deviceContainer}>
          <View style={styles.deviceIconContainer}>
            <DeviceMobileIcon
              color={FPT_ORANGE_COLOR}
              size={deviceWidth / 13}
            />
          </View>
          <View style={styles.deviceDetailInfoContainer}>
            <Text style={styles.deviceDetailName}>
              Name: {device.deviceName}
            </Text>
            <Text style={styles.deviceDetailName}>
              Quantity: {device.deviceQuantity}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const ErrorAlertModal: React.FC = () => {
    return (
      <AlertModal
        isOpened={isErrorModalShown}
        height={deviceWidth / 1.25}
        width={deviceWidth / 1.25}
        toggleShown={() => setErrorModalShown(!isErrorModalShown)}
      >
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexGrow: 0.3,
          }}
        >
          <View>
            <ExclamationCircleIcon
              color={FPT_ORANGE_COLOR}
              size={deviceHeight / 13}
            />
            <Text
              style={{
                color: BLACK,
                fontSize: deviceWidth / 23,
                fontWeight: '500',
                textAlign: 'center',
              }}
            >
              {errorMessage}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={{
                width: deviceWidth / 1.5,
                height: 50,
                borderRadius: 8,
                backgroundColor: FPT_ORANGE_COLOR,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: deviceWidth / 21,
                  fontWeight: '600',
                  color: WHITE,
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </AlertModal>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView
          scrollEnabled={true}
          ref={scrollView}
          bounces
          style={styles.bodyContainer}
        >
          <View>
            <Text style={styles.bookingInforHeaderText}>BOOKING DETAIL</Text>
          </View>
          <View style={styles.bookingInforBody}>
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              <View style={styles.bookingInforHeader}>
                <View style={styles.roomIconContainer}>
                  <LibraryIcon
                    color={FPT_ORANGE_COLOR}
                    size={deviceWidth / 17}
                  />
                </View>
                <Text style={styles.bookingInforHeaderName}>
                  {roomBookingCheckout.roomName}
                </Text>
              </View>

              <View
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <View style={styles.bookingInforSlotInfo}>
                  <View style={styles.slotStart}>
                    <Text style={styles.slotStartTimeText}>
                      {timeSlotCheckin}
                    </Text>
                    <Text style={styles.slotStartSlotText}>
                      {roomBookingCheckout.checkinTime.slice(0,5)}
                    </Text>
                  </View>

                  <View style={styles.slotNavigation}>
                    <ChevronDoubleRightIcon
                      size={deviceWidth / 12}
                      color={BLACK}
                    />
                  </View>
                  <View style={styles.slotEnd}>
                    <Text style={styles.slotEndTimeText}>
                      {timeSlotCheckout}
                    </Text>
                    <Text style={styles.slotEndSlotText}>
                      {roomBookingCheckout.checkoutTime.slice(0,5)}
                    </Text>
                  </View>
                </View>
              </View>

              <Divider num={deviceWidth / 13} />

              <View
                style={{
                  marginTop: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <View style={styles.bookingInforDetail}>
                  <Text style={styles.bookingInforDetailTitle}>Booked by</Text>
                  <Text
                    style={{
                      fontSize: deviceWidth / 23,
                      fontWeight: '600',
                      color: BLACK,
                    }}
                  >
                    {roomBookingCheckout.requestedBy}
                  </Text>
                </View>
                <View style={[styles.bookingInforDetail, { marginTop: 5 }]}>
                  <Text style={styles.bookingInforDetailTitle}>Booked at</Text>
                  <Text
                    style={{
                      fontSize: deviceWidth / 23,
                      fontWeight: '600',
                      color: BLACK,
                    }}
                  >
                    {dayjs(roomBookingCheckout.requestedAt).format(
                      'HH:mm DD/MM/YYYY'
                    )}
                  </Text>
                </View>
                <View style={[styles.bookingInforDetail, { marginTop: 5 }]}>
                  <Text style={styles.bookingInforDetailTitle}>
                    Checked-in at
                  </Text>
                  <Text
                    style={{
                      fontSize: deviceWidth / 23,
                      fontWeight: '600',
                      color: BLACK,
                    }}
                  >
                    {dayjs(roomBookingCheckout.checkedInAt).format(
                      'HH:mm DD/MM/YYYY'
                    )}
                  </Text>
                </View>
              </View>

              <Divider num={deviceWidth / 13} />

              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <QRCode
                    size={deviceWidth / 5}
                    value={roomBookingCheckout.id}
                  />
                  <Text
                    style={{
                      color: BLACK,
                      marginTop: 5,
                    }}
                  >
                    {roomBookingCheckout.id}
                  </Text>
                </View>
                <Text
                  style={{
                    color: BLACK,
                    fontWeight: '500',
                  }}
                >
                  Use this code if you want to check-out at the librarian
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.deviceDetailContainer}>
            {roomBookingCheckout.listDevice.length > 0 ? (
              <Text style={styles.deviceDetailHeaderText}>
                DEVICE(S) DETAIL
              </Text>
            ) : null}
            {roomBookingCheckout.listDevice.map((device) =>
              renderDevice(device)
            )}
          </View>
        </ScrollView>
      </View>
      <ErrorAlertModal />
      <GenericAlertModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  bookingInforHeaderText: {
    color: GRAY,
    fontSize: deviceWidth / 24,
    fontWeight: '600',
    display: 'flex',
    marginBottom: 5,
  },
  bookingInforBody: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: deviceWidth / 1.05,
    height: 410,
    backgroundColor: WHITE,
    borderRadius: 8,
  },
  bookingInforHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingInforHeaderName: {
    fontWeight: '600',
    fontSize: deviceWidth / 21,
    color: BLACK,
    marginLeft: 10,
  },
  bookingInforSlotInfo: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  roomIconContainer: {
    height: 40,
    width: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotStart: {
    display: 'flex',
  },
  slotStartTimeText: {
    fontSize: deviceWidth / 17,
    fontWeight: '600',
    color: BLACK,
  },
  slotStartSlotText: {
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    color: BLACK,
    textAlign: 'center',
  },
  slotNavigation: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotEnd: {
    display: 'flex',
  },
  slotEndTimeText: {
    fontSize: deviceWidth / 17,
    fontWeight: '600',
    color: BLACK,
  },
  slotEndSlotText: {
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    color: BLACK,
    textAlign: 'center',
  },
  bookingInforDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  bookingInforDetailTitle: {
    fontSize: deviceWidth / 23,
    fontWeight: '600',
  },
  bodyContainer: {
    marginLeft: 10,
    marginTop: 10,
    flex: 1,
  },
  footer: {
    height: 90,
    backgroundColor: WHITE,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkOutButton: {
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
    height: 50,
    width: deviceWidth / 1.25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkOutButtonText: {
    color: WHITE,
    fontSize: deviceWidth / 18,
    fontWeight: '600',
  },
  deviceContainer: {
    marginLeft: 10,
    marginRight: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceDetailContainer: {
    marginTop: 20,
  },
  deviceDetailWrapper: {
    width: deviceWidth / 1.05,
    height: 100,
    backgroundColor: WHITE,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 5,
  },
  deviceDetailInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
  },
  deviceDetailHeaderText: {
    color: GRAY,
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    marginBottom: 5,
  },
  deviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceDetailName: {
    color: BLACK,
    fontWeight: '500',
  },
  signatureContainer: {
    marginTop: 20,
    height: 220,
  },
  signatureWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  signatureTitleHeader: {
    color: GRAY,
    fontWeight: '600',
    fontSize: deviceWidth / 23,
    marginBottom: 5,
  },
  clearSignatureButton: {
    backgroundColor: GRAY,
    borderRadius: 50,
    width: 55,
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  clearSignatureButtonText: {
    color: WHITE,
    fontSize: deviceWidth / 28,
    fontWeight: '600',
  },
  signatureBoard: {
    height: 150,
    width: deviceWidth / 1.05,
    backgroundColor: WHITE,
    borderRadius: 8,
  },
});

export default RoomBookingReadyToCheckOut;
