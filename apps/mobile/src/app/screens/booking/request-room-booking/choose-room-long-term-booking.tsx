import React from 'react';
import {
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  VirtualizedList,
} from 'react-native';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';
import {
  BLACK,
  FPT_ORANGE_COLOR,
  INPUT_GRAY_COLOR,
  WHITE,
} from '@app/constants';
import { deviceWidth } from '../../../utils/device';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import { boxShadow } from '../../../utils/box-shadow.util';
import { LibraryIcon, TicketIcon } from 'react-native-heroicons/outline';
import { step2ScheduleRoomBooking } from '../../../redux/features/room-booking/slice';

const ChooseRoomBookingLongTerm: React.FC<any> = (props) => {
  const addRoomBooking = useAppSelector(
    (state) => state.roomBooking.addRoomBooking
  );
  const dispatch = useAppDispatch();
  const navigate = useAppNavigation();

  const ChooseRoomItem: React.FC<any> = (props) => {
    return (
      <View style={[styles.roomBookingItemContainer, boxShadow(styles)]}>
        <View style={styles.roomBookingItem}>
          <View style={styles.libraryIconContainer}>
            <LibraryIcon color={FPT_ORANGE_COLOR} />
          </View>
          <View style={styles.roomBookingDetail}>
            <Text style={styles.roomText}>Library Room</Text>
            <Text style={styles.roomCodeOuterText}>
              Room: {props.item.name}
            </Text>
          </View>
        </View>
        <View style={styles.roomBookActionContainer}>
          <TouchableOpacity
            onPress={() => props.handleRequestRoomBooking()}
            style={styles.bookNowContainer}
          >
            <View style={styles.bookNowButtonContainer}>
              <TicketIcon color={WHITE} />
              <Text style={styles.bookNowButtonText}>Book this room now</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleBookRoom = (item) => {
    dispatch(
      step2ScheduleRoomBooking({
        roomId: item.id,
        roomName: item.name,
      })
    );
    setTimeout(() => {
      navigate.navigate('ROOM_BOOKING_2');
    }, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexGrow: 1,
          flex: 1,
          flexDirection: 'column',
        }}
      >
        <VirtualizedList
          style={{ flex: 1 }}
          getItemCount={(data) => data.length}
          getItem={(data, index) => data[index]}
          data={addRoomBooking.rooms}
          renderItem={(item: ListRenderItemInfo<any>) => (
            <ChooseRoomItem
              handleRequestRoomBooking={() => handleBookRoom(item.item)}
              key={item.index}
              item={item.item}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        <View
          style={{
            height: 80,
            backgroundColor: WHITE,
            borderTopWidth: 1,
            borderTopColor: INPUT_GRAY_COLOR,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => navigate.pop()}
            style={{
              borderRadius: 8,
              backgroundColor: FPT_ORANGE_COLOR,
              height: 50,
              width: deviceWidth / 1.35,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: WHITE,
                fontSize: deviceWidth / 19,
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  roomBookingItem: {
    margin: 10,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  roomBookingItemContainer: {
    borderRadius: 8,
    backgroundColor: WHITE,
    margin: 10,
    height: 170,
  },
  roomBookingDetail: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  libraryIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: FPT_ORANGE_COLOR,
    marginRight: 10,
    marginTop: 10,
  },
  roomBookActionContainer: {
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bookNowContainer: {
    marginTop: 10,
    width: 250,
    height: 50,
    borderRadius: 8,
    backgroundColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },
  bookNowButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bookNowButtonText: {
    marginLeft: 5,
    fontSize: 20,
    fontWeight: '600',
    color: WHITE,
  },
  roomText: {
    fontSize: 20,
    fontWeight: '600',
    color: BLACK,
  },
  roomCodeOuterText: {
    fontSize: 18,
  },
  roomCodeInnerText: {
    marginLeft: 5,
    fontWeight: '600',
  },
});

export default ChooseRoomBookingLongTerm;
