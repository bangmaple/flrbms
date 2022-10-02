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
import {
  BLACK,
  FPT_ORANGE_COLOR,
  GRAY,
  INPUT_GRAY_COLOR,
  WHITE,
} from '@app/constants';
import { deviceHeight, deviceWidth } from '../../../utils/device';
import {
  ChevronLeftIcon,
  ClockIcon,
  ExclamationCircleIcon,
  HomeIcon,
  LibraryIcon,
  PencilIcon,
} from 'react-native-heroicons/outline';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import SignatureAlertModal from './signature-alert-modal';
import ReadyToCheckinBookingInformation from './booking-information';
import ReadyToCheckinMoreInformation from './more-information';
import { attemptCheckinBookingRoom } from '../../../redux/features/room-booking/thunk/attempt-checkin-booking-room.thunk';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';
import AlertModal from '../../../components/modals/alert-modal.component';
import QRCode from 'react-native-qrcode-svg';
import Divider from '../../../components/text/divider';
import dayjs from 'dayjs';
import { fetchAllSlots } from '../../../redux/features/slot';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import { API_IP } from '../../../constants/constant';

const RoomBookingReadyToCheckIn: React.FC<any> = () => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  const scrollView = useRef<ScrollView>(null);

  navigate.addListener('focus', (a) => {
    setHidden(false);
  });

  useEffect(() => {
    return () => {
      setHidden(false);
    };
  }, []);
  const [isScrollEnabled, setScrollEnabled] = useState<boolean>(true);

  const [isHidden, setHidden] = useState(false);

  const [isErrorModalShown, setErrorModalShown] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('Error');
  const slots = useAppSelector((state) => state.slot.slots);
  const bookingRoom = useAppSelector(
    (state) => state.roomBooking.currentCheckinInformation
  );

  const [timeSlotCheckin, setTimeSlotCheckin] = useState('');
  const [timeSlotCheckout, setTimeSlotCheckout] = useState('');
  const [isQRModalShown, setQRModalShown] = useState<boolean>(false);
  const [isCheckinSuccessModalShown, setCheckinSuccessModalShown] =
    useState(false);

  const socket = useMemo(() => {
    return SocketIOClient(`http://${API_IP}:5000/booking`, {
      jsonp: false,
      transports: ['websocket'],
    });
  }, []);

  useEffect(() => {
    if (isQRModalShown) {
      socket.on('msgToServer', (e) => {
        if (e === bookingRoom.id) {
          setQRModalShown(false);
          setCheckinSuccessModalShown(!isCheckinSuccessModalShown);
        }
      });
    }
  }, [isQRModalShown]);

  useEffect(() => {
    dispatch(fetchAllSlots())
      .unwrap()
      .then((value) => {
        setTimeSlotCheckin(
          value
            .find((slot) => slot.slotNum === bookingRoom.checkinSlot)
            .timeStart.slice(0, 5)
        );
        setTimeSlotCheckout(
          value
            .find((slot) => slot.slotNum === bookingRoom.checkoutSlot)
            .timeEnd.slice(0, 5)
        );
      });
  }, []);

  useEffect(() => {
    dispatch(fetchAllSlots())
      .unwrap()
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .then((val) => {});
    return () => {
      setQRModalShown(false);
      setErrorModalShown(false);
    };
  }, []);

  const GenericAlertModal = () => {
    return (
      <AlertModal
        isOpened={isCheckinSuccessModalShown}
        height={180}
        width={deviceWidth / 1.1}
        toggleShown={() => setTimeout(() => navigate.replace('MAIN'), 1)}
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
            You have successfully checked-in!
          </Text>
          <TouchableOpacity
            onPress={() => {
              setCheckinSuccessModalShown(!isCheckinSuccessModalShown);
              setTimeout(() => navigate.replace('MAIN'), 1);
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

  const handleGetData = () => {
    dispatch(
      attemptCheckinBookingRoom({
        id: bookingRoom.id,
      })
    )
      .unwrap()
      .then(() => setQRModalShown(!isQRModalShown))
      .catch(() => {
        setErrorMessage(
          'Failed while processing your request. Please try again.'
        );
        setErrorModalShown(true);
      });
  };

  const ReadyToCheckinHeader: React.FC<any> = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backNavigation}
          onPress={() => navigate.pop()}
        >
          <ChevronLeftIcon size={deviceWidth / 14} color={FPT_ORANGE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>
          Attempt to checkin booking room
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: WHITE }}>
      <AlertModal
        isOpened={isQRModalShown}
        height={deviceHeight / 1.9}
        width={deviceWidth / 1.1}
        toggleShown={() => setQRModalShown(!isQRModalShown)}
      >
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'column',
            flex: 1,
            flexGrow: 0.9,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <QRCode value={bookingRoom.id} size={deviceWidth / 2.5} />
            <Divider num={deviceWidth / 12} />
          </View>

          <View>
            <Text
              style={{
                fontSize: deviceWidth / 23,
                fontWeight: '600',
                textAlign: 'center',
                color: BLACK,
              }}
            >
              Please let the librarian scan this QR in order to checkin
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: deviceWidth / 1.4,
              }}
            >
              <LibraryIcon size={deviceWidth / 14} color={BLACK} />
              <Text
                style={{
                  fontWeight: '500',
                }}
              >
                Room {bookingRoom.roomName}
              </Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: deviceWidth / 1.4,
              }}
            >
              <ClockIcon size={deviceWidth / 14} color={BLACK} />
              <Text
                style={{
                  fontWeight: '500',
                }}
              >
                Checkin at {timeSlotCheckin}{' '}
                {dayjs(bookingRoom.checkinDate).format('hh:mm - DD/MM/YYYY')}
              </Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: deviceWidth / 1.4,
              }}
            >
              <ClockIcon size={deviceWidth / 14} color={BLACK} />
              <Text
                style={{
                  fontWeight: '500',
                }}
              >
                Checkout at {timeSlotCheckout}{' '}
                {dayjs(bookingRoom.checkinDate).format('hh:mm - DD/MM/YYYY')}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
            width: deviceWidth / 1.15,
          }}
        >
          <TouchableOpacity
            onPress={() => navigate.replace('MAIN')}
            style={{
              height: 50,
              width: deviceWidth / 2,
              backgroundColor: FPT_ORANGE_COLOR,
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <HomeIcon size={deviceWidth / 18} color={WHITE} />
            <Text
              style={{
                color: WHITE,
                fontWeight: '600',
                fontSize: deviceWidth / 23,
              }}
            >
              Back to home
            </Text>
          </TouchableOpacity>
        </View>
      </AlertModal>
      <ReadyToCheckinHeader />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={isScrollEnabled}
          ref={scrollView}
          bounces={false}
        >
          <ReadyToCheckinBookingInformation />
          <ReadyToCheckinMoreInformation />
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => handleGetData()}
            style={styles.checkOutButton}
          >
            <Text style={styles.checkOutButtonText}>Proceed to check in</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SignatureAlertModal
        message={errorMessage}
        handleShown={() => setErrorModalShown(!isErrorModalShown)}
        isShown={isErrorModalShown}
      />
      <GenericAlertModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexGrow: 1,
    flex: 1,
    justifyContent: 'space-between',
  },
  headerTitleText: {
    color: BLACK,
    fontWeight: '600',
    fontSize: deviceWidth / 21,
  },
  informationHeaderTitle: {
    marginTop: 20,
    color: GRAY,
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    marginLeft: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  backNavigation: {
    display: 'flex',
    marginRight: 20,
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

  footer: {
    height: 80,
    backgroundColor: WHITE,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: INPUT_GRAY_COLOR,
    borderTopWidth: 1,
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
  signatureView: {
    marginTop: 10,
    display: 'flex',
    width: deviceWidth / 1.1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: INPUT_GRAY_COLOR,
    alignSelf: 'center',
    height: 150,
  },
});

export default RoomBookingReadyToCheckIn;
