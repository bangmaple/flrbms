import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  VirtualizedList,
} from 'react-native';
import ChooseRoomBookingHeader from './ChooseRoom/header';
import ChooseRoomItem from './ChooseRoom/ChooseRoomItem';
import ChooseRoomBookingFooter from './ChooseRoom/footer';
import { useAppSelector } from '../../hooks/use-app-selector.hook';
import { useAppDispatch } from '../../hooks/use-app-dispatch.hook';
import { fetchChoosingBookingRoom } from '../../redux/features/room-booking/thunk/fetch-choosing-booking-room.thunk';
import { ChoosingBookingRoom } from '../../redux/models/choosing-booking-room.model';
import { deviceHeight } from '../../utils/device';
import { LOCAL_STORAGE } from '../../utils/local-storage';
import { WHITE } from '@app/constants';

const RoomBookingChooseRoom: React.FC = () => {
  const dispatch = useAppDispatch();
  const choosingBookingRooms = useAppSelector(
    (state) => state.roomBooking.choosingBookingRooms
  );
  const [roomName, setRoomName] = useState<string>('');
  const [roomNameProps, setRoomNameProps] = useState<string>('');
  const [roomType, setRoomType] = useState<string>('');
  const [sortRoomName, setSortRoomName] = useState<string>('ASC');
  const [sortRoomType, setSortRoomType] = useState<string>('ASC');
  const user = LOCAL_STORAGE.getString('user');
  const historySearch = LOCAL_STORAGE.getString(
    JSON.parse(user).username
  ).split(',');

  const [roomId, setRoomId] = useState<string>(undefined);

  useEffect(() => {
    dispatch(
      fetchChoosingBookingRoom({
        roomType: {
          name: roomType,
          sort: sortRoomType,
        },
        roomName: {
          name: roomName,
          sort: sortRoomName,
        },
      })
    );
  }, [roomName, roomType, sortRoomName, sortRoomType]);

  const history = ({ item, index }) => {
    return (
      <View style={styles.historyContainer}>
        <Text>{item}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <ChooseRoomBookingHeader
            roomName={roomName}
            setRoomName={(val) => setRoomName(val)}
            roomType={roomType}
            setRoomType={(val) => setRoomType(val)}
            sortRoomName={sortRoomName}
            sortRoomType={sortRoomType}
            setSortRoomName={(val) => setSortRoomName(val)}
            setSortRoomType={(val) => setSortRoomType(val)}
          />
          <Text style={styles.historyText}>History: </Text>
          <FlatList
            horizontal
            pagingEnabled={true}
            showsHorizontalScrollIndicator={true}
            data={historySearch}
            renderItem={(item) => history(item)}
          />
          <VirtualizedList
            style={{
              height: deviceHeight / 1.55,
            }}
            data={choosingBookingRooms}
            getItemCount={(data) => data.length}
            getItem={(data, index) => data[index]}
            renderItem={(item: ListRenderItemInfo<ChoosingBookingRoom>) => (
              <ChooseRoomItem
                roomId={roomId}
                setRoomId={(id) => setRoomId(id)}
                setRoomName={(roomName) => setRoomNameProps(roomName)}
                item={item.item}
              />
            )}
          />
        </View>
        <ChooseRoomBookingFooter roomId={roomId} roomName={roomNameProps} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    flex: 1,
  },
  historyContainer: {
    backgroundColor: WHITE,
    marginHorizontal: 5,
    padding: 5,
  },
  historyText: {
    fontWeight: '700',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default RoomBookingChooseRoom;
