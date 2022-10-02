import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { fetchRoomBookingById } from '../../../redux/features/room-booking/thunk/fetch-room-booking-by-id.thunk';

const BookingQRScan: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const navigate = useAppNavigation();

  const onSuccess = (e) => {
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    const qrData = e.data as string;
    if (qrData.match(regexExp)) {
      dispatch(fetchRoomBookingById(qrData))
        .unwrap()
        .then((e) => {
          if (navigate.getState().routeNames[0] === 'Home') {
            navigate.navigate('QR_ACCEPT_BOOKING');
          } else {
            navigate.navigate('ACCEPT_ROOM_BOOKING');
          }
        })
        .catch((e) => {
          alert(
            'Failed while processing your booking request QR code. Please try again'
          );
        });
    } else {
      alert('Must be a valid booking request QR Code. Please try again');
    }
  };

  return (
    <QRCodeScanner
      fadeIn
      reactivate
      reactivateTimeout={2000}
      cameraTimeoutView={
        <View>
          <Text>asss</Text>
        </View>
      }
      onRead={onSuccess}
      showMarker
      markerStyle={{
        borderWidth: 2,
        borderRadius: 8,
        borderColor: FPT_ORANGE_COLOR,
      }}
      cameraProps={{
        flashMode: 'on',
      }}
      bottomContent={
        <TouchableOpacity style={styles.buttonTouchable}>
          <Text style={styles.buttonText}>OK. Got it!</Text>
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default BookingQRScan;
