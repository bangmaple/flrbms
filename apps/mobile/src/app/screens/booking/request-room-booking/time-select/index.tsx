import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {ClockIcon, UsersIcon} from "react-native-heroicons/outline";
import {BLACK, FPT_ORANGE_COLOR, GRAY, WHITE} from "@app/constants";
import {deviceWidth} from "../../../../utils/device";
import SelectTimeModal from "./select-time-modal";
import dayjs from "dayjs";


const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;

interface RequestRoomBookingTimeSelectProps  {
  title: string;
  height: number;
  width: number;
  value: string;
  setValue(val: string): void;
}

const RequestRoomBookingTimeSelect: React.FC<RequestRoomBookingTimeSelectProps> = (props) => {

  const [isModalShown, setModalShown] = useState(false);
  const [timeValue, setTimeValue] = useState(dayjs().hour(parseInt(props.value.split(":")[0]))
    .minute(parseInt(props.value.split(":")[1]))
    .toDate().getTime() % MILLISECONDS_PER_DAY);

  const handleSetTime = (val: number) => {
    setModalShown(!isModalShown);
    setTimeValue(val);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {props.title}
      </Text>
      <TouchableOpacity style={[styles.inputSelect, {height: props.height, width: props.width}]}
                        onPress={() => setModalShown(!isModalShown)}>
        <Text style={styles.inputSelectText}>{props.value}</Text>
        <ClockIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 16}/>
      </TouchableOpacity>
      <SelectTimeModal timeText={props.value} setTimeText={(val) => {
        props.setValue(val);
        setModalShown(!isModalShown);
      }} isShown={isModalShown}
                       toggleShown={() => setModalShown(!isModalShown)} time={timeValue}
                       handleSetTime={(val) => handleSetTime(val)}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    color: BLACK,
    paddingBottom: 10
  },
  inputSelect: {
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'rgba(240, 110, 40, 0.2)',
    justifyContent: 'space-between',
  },
  inputSelectText: {
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    color: GRAY,
  }
});

export default RequestRoomBookingTimeSelect;
