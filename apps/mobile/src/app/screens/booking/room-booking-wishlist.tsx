import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  VirtualizedList,
} from 'react-native';
import { fetchAllWishlistRooms } from '../../redux/features/room-booking/thunk/fetch-all-wishlist.thunk';
import {
  ExclamationCircleIcon,
  SearchIcon,
} from 'react-native-heroicons/solid';
import {
  BLACK,
  FPT_ORANGE_COLOR,
  GRAY,
  LIGHT_GRAY,
  RED,
  WHITE,
} from '@app/constants';
import { deviceWidth } from '../../utils/device';
import { RoomWishListResponse } from '../../redux/models/wishlist-booking-room.model';
import {
  ArrowRightIcon,
  ClockIcon,
  LibraryIcon,
  TicketIcon,
  XIcon,
} from 'react-native-heroicons/outline';
import { getTimeDetailBySlotNumber } from '../../utils/slot-resolver.util';
import { removeWishlistBookingRoom } from '../../redux/features/room-booking/thunk/remove-wishlist-booking-room.thunk';
import Empty from '../../components/empty.svg';
import AlertModal from '../../components/modals/alert-modal.component';
import DelayInput from 'react-native-debounce-input';
import RNPickerSelect from 'react-native-picker-select';
import { useAppNavigation } from '../../hooks/use-app-navigation.hook';
import { useAppDispatch } from '../../hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../hooks/use-app-selector.hook';
import { SLOTS } from '../../constants/slot.constant';
import { boxShadow } from '../../utils/box-shadow.util';
import { fetchAllSlots } from '../../redux/features/slot';
import { step1BookRoomFromWishList } from '../../redux/features/room-booking/slice';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RoomBookingWishlistProps {}

const RoomBookingWishlist: React.FC<RoomBookingWishlistProps> = (_props) => {
  const wishlistBookingRooms = useAppSelector(
    (state) => state.roomBooking.wishlistBookingRooms
  );
  const dispatch = useAppDispatch();
  const navigate = useAppNavigation();

  const [isConfirmDeleteModalShown, setConfirmDeleteModalShown] =
    useState<boolean>(false);
  const [deleteBookingRoom, setDeleteBookingRoom] = useState<{
    roomId: string;
    slot: number;
  }>(null);

  const [searchRoomName, setSearchRoomName] = useState<string>('');
  const [slotSelections, setSlotSelections] = useState([]);

  const [slotStart, setSlotStart] = useState<number>(1);
  const [slotEnd, setSlotEnd] = useState<number>(6);

  useEffect(() => {
    setTimeout(() => {
      dispatch(
        fetchAllWishlistRooms({
          search: searchRoomName,
          from: slotStart,
          to: slotEnd,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(fetchAllSlots())
            .unwrap()
            .then((value) => {
              setSlotSelections(value);
            });
        });
    }, 400);
    return () => {
      setSlotSelections([]);
    };
  }, [searchRoomName, slotStart, slotEnd, dispatch]);

  const handleRemoveBookingRoomFromWishlist = async (
    roomId: string,
    slot: number
  ) => {
    setDeleteBookingRoom({
      roomId: roomId,
      slot: slot,
    });
    setConfirmDeleteModalShown(true);
  };

  const handleAttemptRemoveBookingRoomFromWishlist = async () => {
    setConfirmDeleteModalShown(false);
    dispatch(removeWishlistBookingRoom(deleteBookingRoom))
      .unwrap()
      .then(() =>
        dispatch(
          fetchAllWishlistRooms({
            search: searchRoomName,
            from: slotStart,
            to: slotEnd,
          })
        )
      );
  };

  const handleBookThisRoom = (roomId, slot, roomName) => {
    const mySlot = slotSelections.find((item) => item.slotNum === slot);
    dispatch(
      step1BookRoomFromWishList({
        roomId: roomId,
        roomName: roomName,
        fromSlot: mySlot.id,
        toSlotNum: mySlot.slotNum,
        toSlot: mySlot.id,
      })
    );
    setTimeout(() => {
      navigate.navigate('BOOKING_WISHLIST_CHOOSE_DAY');
    }, 0);
  };

  const handleSetSlotStart = (value) => {
    if (!value) {
      setSlotStart(1);
    }
    setSlotStart(value);
  };

  const handleSetSlotEnd = (value) => {
    if (!value) {
      setSlotEnd(1);
    }
    setSlotEnd(value);
  };

  const RoomWishlistItem: React.FC<RoomWishListResponse> = (item) => {
    const duration = getTimeDetailBySlotNumber(item.slot);
    return (
      <View style={[styles.roomWishlistContainer, boxShadow(styles)]}>
        <View style={styles.libraryHeaderContainer}>
          <View style={styles.roomLibraryIconContainer}>
            <LibraryIcon color={FPT_ORANGE_COLOR} />
          </View>
          <View style={styles.libraryInfoContainer}>
            <Text style={styles.libraryRoomText}>Library Room</Text>
            <Text style={{ fontSize: deviceWidth / 25 }}>
              Room Code: {item.roomname}
            </Text>
            <Text style={{ fontSize: deviceWidth / 25 }}>
              Time: Slot {item.slot} ({duration.startTime} - {duration.endTime})
            </Text>
          </View>
        </View>
        <View style={styles.roomWishlistButtonContainer}>
          <TouchableOpacity
            style={styles.removeFromWishlistButton}
            onPress={() =>
              handleRemoveBookingRoomFromWishlist(item.roomid, item.slot)
            }
          >
            <XIcon color={RED} size={deviceWidth / 15} />
            <Text style={styles.removeFromWishlistButtonText}>
              Remove from wishlist
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookThisRoomButtonContainer}
            onPress={() =>
              handleBookThisRoom(item.roomid, item.slot, item.roomname)
            }
          >
            <TicketIcon color={WHITE} size={deviceWidth / 15} />
            <Text style={styles.bookThisRoomButtonText}>
              Book this room now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const DeleteConfirmModal: React.FC = () => {
    return (
      <AlertModal
        isOpened={isConfirmDeleteModalShown}
        height={deviceWidth / 1.7}
        width={deviceWidth / 1.3}
        toggleShown={() => setConfirmDeleteModalShown(false)}
      >
        <View style={deleteConfirmModalStyles.container}>
          <View style={deleteConfirmModalStyles.body}>
            <ExclamationCircleIcon
              color={FPT_ORANGE_COLOR}
              size={deviceWidth / 8}
            />
            <Text style={deleteConfirmModalStyles.textContent}>
              Are you sure want to delete this booking room from wishlist?
            </Text>
          </View>
          <View style={deleteConfirmModalStyles.footer}>
            <TouchableOpacity
              onPress={() => setConfirmDeleteModalShown(false)}
              style={deleteConfirmModalStyles.cancelButton}
            >
              <Text style={deleteConfirmModalStyles.cancelButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={deleteConfirmModalStyles.removeButton}
              onPress={() => handleAttemptRemoveBookingRoomFromWishlist()}
            >
              <Text style={deleteConfirmModalStyles.removeButtonText}>
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </AlertModal>
    );
  };

  const EmptyData: React.FC = () => {
    return (
      <View style={emptyDataStyles.container}>
        <Empty height={deviceWidth / 1.5} width={deviceWidth / 1.5} />
        <Text style={emptyDataStyles.textContent}>No data found!</Text>
      </View>
    );
  };

  const Filtering: React.FC = () => {
    return (
      <View style={styles.filterContainer}>
        <Text style={styles.filterHeaderText}>FILTERING</Text>
        <View style={styles.filterBodyContainer}>
          <View style={styles.filterInputContainer}>
            <View style={styles.filterInputIconContainer}>
              <SearchIcon color={BLACK} />
            </View>
            <View style={styles.filterInput}>
              <DelayInput
                value={searchRoomName}
                minLength={0}
                onChangeText={(text) => setSearchRoomName(text.toString())}
                placeholder="Search by room name"
              />
            </View>
          </View>

          <View
            style={[
              styles.filterInputContainer,
              {
                justifyContent: 'space-around',
              },
            ]}
          >
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 8,
                backgroundColor: LIGHT_GRAY,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ClockIcon color={BLACK} />
            </View>
            <View
              style={{
                width: deviceWidth / 3.3,
                height: 50,
                backgroundColor: LIGHT_GRAY,
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <RNPickerSelect
                fixAndroidTouchableBug={true}
                items={SLOTS}
                style={{
                  inputAndroid: {
                    color: BLACK,
                    fontWeight: '600',
                  },
                }}
                useNativeAndroidPickerStyle={false}
                value={slotStart}
                onValueChange={(value) => handleSetSlotStart(value)}
              />
            </View>
            <View
              style={{
                height: 50,
                width: 50,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: LIGHT_GRAY,
                borderRadius: 8,
              }}
            >
              <ArrowRightIcon color={BLACK} size={deviceWidth / 15} />
            </View>
            <View
              style={{
                width: deviceWidth / 3.3,
                height: 50,
                backgroundColor: LIGHT_GRAY,
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <RNPickerSelect
                fixAndroidTouchableBug={true}
                items={SLOTS}
                style={{
                  inputAndroid: {
                    color: BLACK,
                    fontWeight: '600',
                  },
                }}
                useNativeAndroidPickerStyle={false}
                value={slotEnd}
                onValueChange={(value) => handleSetSlotEnd(value)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Filtering />
      {wishlistBookingRooms.length > 0 ? (
        <VirtualizedList
          getItemCount={(data) => data.length}
          getItem={(data, index) => data[index]}
          data={wishlistBookingRooms}
          renderItem={({ item }: { item: RoomWishListResponse }) => (
            <RoomWishlistItem
              roomname={item.roomname}
              id={item.id}
              slot={item.slot}
              roomid={item.roomid}
              stt={item.stt}
            />
          )}
        />
      ) : (
        <EmptyData />
      )}
      <DeleteConfirmModal />
    </SafeAreaView>
  );
};

const emptyDataStyles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexGrow: 0.8,
  },
  textContent: {
    color: BLACK,
    fontSize: deviceWidth / 18,
    fontWeight: '600',
  },
});

const deleteConfirmModalStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexGrow: 0.7,
    justifyContent: 'space-around',
  },
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  textContent: {
    color: BLACK,
    fontSize: deviceWidth / 24,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: RED,
    borderRadius: 8,
    width: deviceWidth / 3.5,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: deviceWidth / 21,
    fontWeight: '600',
    color: RED,
  },
  removeButton: {
    backgroundColor: RED,
    borderRadius: 8,
    width: deviceWidth / 3.5,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: WHITE,
    fontSize: deviceWidth / 21,
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  filterContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
    backgroundColor: WHITE,
    height: 160,
    borderRadius: 8,
  },
  filterHeaderText: {
    color: GRAY,
    fontSize: deviceWidth / 25,
    fontWeight: '600',
    marginTop: 5,
    marginLeft: 10,
  },
  filterBodyContainer: {
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  filterInputContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  filterInputIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: LIGHT_GRAY,
  },
  filterInput: {
    backgroundColor: LIGHT_GRAY,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    height: 50,
    width: deviceWidth / 1.3,
  },
  filterSortButton: {
    width: 50,
    height: 50,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomWishlistContainer: {
    backgroundColor: WHITE,
    width: deviceWidth / 1.05,
    height: 220,
    margin: 10,

    borderRadius: 8,
  },
  roomLibraryIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: FPT_ORANGE_COLOR,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  libraryRoomText: {
    color: BLACK,
    fontSize: deviceWidth / 22,
    fontWeight: '600',
  },
  roomWishlistButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexGrow: 1,
  },
  bookThisRoomButtonContainer: {
    backgroundColor: FPT_ORANGE_COLOR,
    height: 50,
    borderRadius: 8,
    width: deviceWidth / 1.6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  bookThisRoomButtonText: {
    color: WHITE,
    fontSize: deviceWidth / 20,
    fontWeight: '600',
  },
  libraryInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
  },
  libraryHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
  },
  removeFromWishlistButton: {
    borderWidth: 2,
    borderColor: RED,
    borderRadius: 8,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: deviceWidth / 1.6,
  },
  removeFromWishlistButtonText: {
    color: RED,
    fontSize: deviceWidth / 20,
    fontWeight: '600',
  },
});

export default RoomBookingWishlist;
