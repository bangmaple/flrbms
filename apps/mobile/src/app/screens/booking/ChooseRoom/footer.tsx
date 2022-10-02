import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ExclamationCircleIcon,
} from 'react-native-heroicons/outline';
import { BLACK, FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import { deviceWidth } from '../../../utils/device';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import AlertModal from '../../../components/modals/alert-modal.component';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import { step2ScheduleRoomBooking } from '../../../redux/features/room-booking/slice';
import { LOCAL_STORAGE } from '../../../utils/local-storage';

interface ChooseRoomBookingFooterProps {
  roomId: string;
  roomName: string;
}

const ChooseRoomBookingFooter: React.FC<ChooseRoomBookingFooterProps> = (
  props
) => {
  const [isErrorModalShown, setErrorModalShown] = useState<boolean>(false);
  const user = LOCAL_STORAGE.getString('user');
  const historySearch = user
    ? LOCAL_STORAGE.getString(JSON.parse(user).username)
    : null;
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();
  const handleNextStep = () => {
    try {
      if (historySearch !== undefined) {
        const myHistorySearchArray = historySearch.split(',');
        myHistorySearchArray.push(props.roomName);
        LOCAL_STORAGE.set(
          JSON.parse(user).username,
          myHistorySearchArray.toString()
        );
      } else {
        LOCAL_STORAGE.set(
          JSON.parse(user).username,
          [props.roomName].toString()
        );
      }
    } catch (e) {}
    if (props.roomId === undefined) {
      setErrorModalShown(true);
    } else {
      dispatch(
        step2ScheduleRoomBooking({
          roomId: props.roomId,
          roomName: props.roomName,
        })
      );
      navigate.navigate('ROOM_BOOKING_2');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          onPress={() => navigate.pop()}
          style={styles.returnBackButton}
        >
          <ChevronDoubleLeftIcon
            color={FPT_ORANGE_COLOR}
            size={deviceWidth / 18}
          />
          <Text style={styles.returnBackButtonText}>Return back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleNextStep()}
          style={styles.chooseDevicesButton}
        >
          <Text style={styles.chooseDevicesButtonText}>Choose devices</Text>
          <ChevronDoubleRightIcon color={WHITE} size={deviceWidth / 18} />
        </TouchableOpacity>
        <AlertModal
          isOpened={isErrorModalShown}
          height={deviceWidth / 1.7}
          width={deviceWidth / 1.3}
          toggleShown={() => setErrorModalShown(!isErrorModalShown)}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ExclamationCircleIcon
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
                Please select a room before going to the next step
              </Text>
            </View>
            <TouchableOpacity
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 40,
                width: deviceWidth / 1.7,
                backgroundColor: FPT_ORANGE_COLOR,
                borderRadius: 8,
              }}
              onPress={() => setErrorModalShown(false)}
            >
              <Text
                style={{
                  color: WHITE,
                  fontSize: deviceWidth / 23,
                  fontWeight: '600',
                }}
              >
                I understand
              </Text>
            </TouchableOpacity>
          </View>
        </AlertModal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: WHITE,
    position: 'absolute',
    height: 70,
    bottom: 0,
    left: 0,
    right: 0,
  },
  returnBackButton: {
    borderWidth: 2,
    borderColor: FPT_ORANGE_COLOR,
    height: 50,
    backgroundColor: WHITE,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    width: deviceWidth / 2.2,
  },
  returnBackButtonText: {
    color: FPT_ORANGE_COLOR,
    fontSize: deviceWidth / 21,
    fontWeight: '600',
  },

  chooseDevicesButton: {
    width: deviceWidth / 2.2,
    height: 50,
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  chooseDevicesButtonText: {
    color: WHITE,
    fontSize: deviceWidth / 21,
    fontWeight: '600',
  },
});

export default ChooseRoomBookingFooter;
