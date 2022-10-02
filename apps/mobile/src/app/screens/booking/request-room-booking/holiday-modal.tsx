import React, {useEffect} from 'react';
import {
  ListRenderItem,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  VirtualizedList
} from "react-native";
import {useAppSelector} from "../../../hooks/use-app-selector.hook";
import AlertModal from "../../../components/modals/alert-modal.component";
import {deviceHeight, deviceWidth} from "../../../utils/device";
import {BookingRoom} from "../../../redux/models/booking-room.model";
import {Holiday} from "../../../redux/models/holiday.model";
import {BLACK, FPT_ORANGE_COLOR, GRAY, WHITE} from "@app/constants";
import {CalendarIcon, XIcon} from "react-native-heroicons/outline";
import dayjs from "dayjs";

interface HolidayCalendarModalProps {
  isOpened: boolean;
  toggleOpen(): void;
}

const HolidayCalendarModal: React.FC<HolidayCalendarModalProps> = (props) => {

  const holidays = useAppSelector((state) => state.holidays.holidays);

  const HolidayItemRender: React.FC<{item: any}> = (props) => {

    return (
      <View style={{
          height: 80,
        width: deviceWidth / 1.2,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: FPT_ORANGE_COLOR,
        flexDirection: 'row',
        marginTop: 10,

      }}>
        <View style={{
          height: 50,
          width: 50,
          borderWidth: 2,
          borderRadius: 50,
          borderColor: FPT_ORANGE_COLOR,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 10,
          alignSelf: 'center'
        }}>
          <CalendarIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 16}/>
        </View>
        <View style={{
          paddingLeft: 10,
        }}>
          <Text style={{fontWeight: '600', fontSize: deviceWidth / 23, color: BLACK}}>{props.item.item.name}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: '600', fontSize: deviceWidth / 23, color: GRAY}}>From:</Text>
            <Text style={{fontWeight: '500', fontSize: deviceWidth / 23, color: BLACK, paddingLeft: 6}}>
              {dayjs(props.item.item.start).format('ddd DD/MM/YYYY')}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: '600', fontSize: deviceWidth / 23, color: GRAY}}>To:</Text>
          <Text style={{fontWeight: '500', fontSize: deviceWidth / 23, color: BLACK, paddingLeft: 26}}>
            {dayjs(props.item.item.end).format('ddd DD/MM/YYYY')}
          </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <AlertModal isOpened={props.isOpened}
                height={deviceHeight / 1.6} width={deviceWidth / 1.05}
                toggleShown={() => props.toggleOpen()}>
      <Text style={{color: BLACK, fontWeight: '600', fontSize: deviceWidth / 21}}>Holidays</Text>
      <VirtualizedList
        style={{
          maxHeight: deviceHeight / 2.1
        }}
        showsVerticalScrollIndicator={false}
        data={holidays}
        keyExtractor={({item}, index) => String(index)}
        getItemCount={() => holidays.length}
        getItem={(data, index) => data[index]}
        renderItem={( item : { item: ListRenderItemInfo<Holiday> }) => (
          <HolidayItemRender item={item} />
        )}
      />
        <TouchableOpacity style={{
          backgroundColor: FPT_ORANGE_COLOR,
          borderRadius: 8,
          height: 50,
          width: deviceWidth / 1.45,
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
        }} onPress={() => props.toggleOpen()}>
          <XIcon color={WHITE} size={deviceWidth / 16}/>
          <Text style={{color: WHITE, fontSize: deviceWidth / 23, fontWeight: '600'}}>Close</Text>
        </TouchableOpacity>
    </AlertModal>
  );
}

const styles = StyleSheet.create({

});

export default HolidayCalendarModal;
