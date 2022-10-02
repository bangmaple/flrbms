import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AlertModal from "../../../../components/modals/alert-modal.component";
import {deviceHeight, deviceWidth} from "../../../../utils/device";

interface SelectTimeModalProps {
  isShown: boolean;
  toggleShown(): void;
  time: number;
  timeText: string;
  setTimeText(val: string): void;
  handleSetTime(val: number): void;
}

import TimePicker from 'react-native-wheel-time-picker';
import {BLACK, FPT_ORANGE_COLOR, INPUT_GRAY_COLOR, WHITE} from "@app/constants";
import {CheckIcon, XIcon} from "react-native-heroicons/outline";
import dayjs from "dayjs";

const MILLISECONDS_PER_MINUTE = 60 * 1000;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;

const SelectTimeModal: React.FC<SelectTimeModalProps> = (props) => {

  const [selectedTime, setSelectedTime] = useState(props.time);

  const [hour, min] = useMemo(() => {
    return [
      Math.floor(selectedTime / MILLISECONDS_PER_HOUR),
      Math.floor((selectedTime % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE),
      Math.floor((selectedTime % MILLISECONDS_PER_MINUTE) / 1000),
    ];
  }, [selectedTime]);

  return (
    <AlertModal isOpened={props.isShown} height={deviceHeight / 2.8} width={deviceWidth / 1.25}
                toggleShown={() => props.toggleShown()}>
      <View style={{
        display: 'flex',
        paddingLeft: 16,
        paddingRight: 10,
        paddingBottom: 30,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: deviceWidth / 1.25
      }}>
        <Text style={{
          fontSize: deviceWidth / 21,
          fontWeight: '600',
          color: BLACK
        }}>Choose your desire time</Text>
        <TouchableOpacity onPress={() => props.toggleShown()}>
          <XIcon color={INPUT_GRAY_COLOR} size={deviceWidth / 16}/>
        </TouchableOpacity>
      </View>
      <TimePicker
        value={props.time}
        wheelProps={{
          containerStyle: {
            width: 100,

          },
          textStyle: {
            fontSize: deviceWidth / 16,
          },
          wheelHeight: 150,
          itemHeight: 30,
        }}
        onChange={(newValue) => setSelectedTime(newValue)}
      />
      <Text style={styles.timeValue}>{`${hour < 10 ? '0' : ''}${hour}:${
        min < 10 ? '0' : ''
      }${min}`}</Text>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: deviceWidth / 1.3,
        paddingLeft: 10,
        paddingRight: 10,
      }}>
        <TouchableOpacity style={{
          backgroundColor: FPT_ORANGE_COLOR,
          width: deviceWidth / 2.9,
          height: 45,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }} onPress={() => props.toggleShown()}>
          <XIcon color={WHITE} size={deviceWidth / 16}/>
          <Text style={{color: WHITE, fontSize: deviceWidth / 23, fontWeight: '600', paddingLeft: 10,}}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          backgroundColor: FPT_ORANGE_COLOR,
          width: deviceWidth / 2.9,
          height: 45,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }} onPress={() => props.setTimeText(`${hour < 10 ? '0' : ''}${hour}:${
          min < 10 ? '0' : ''
        }${min}`)}>
          <CheckIcon color={WHITE} size={deviceWidth / 16}/>
          <Text style={{color: WHITE, fontSize: deviceWidth / 23, fontWeight: '600', paddingLeft: 10,}}>Choose</Text>
        </TouchableOpacity>
      </View>
    </AlertModal>
  );
};

const styles = StyleSheet.create({
  timeValue: {
    marginVertical: 20,
    fontWeight: '500',
    fontSize: deviceWidth / 21,
    color: BLACK,
  },
});

export default SelectTimeModal;
