import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  HeartIcon,
  LibraryIcon,
  TicketIcon,
} from 'react-native-heroicons/outline';
import { FPT_ORANGE_COLOR, PINK, WHITE } from '@app/constants';
import { styles } from '../room-booking-choose-slot-screen';
import { boxShadow } from '../../../../utils/box-shadow.util';

interface ChooseSlotItemProps {
  item: any;
  handleRequestRoomBooking(): void;
  handleAddWishlist(): void;
}

const ChooseSlotItem: React.FC<ChooseSlotItemProps> = (props) => {
  return (
    <View
      key={`${props.item.roomId}-${props.item.slotId}`}
      style={[styles.roomBookingItemContainer, boxShadow(styles)]}
    >
      <View style={styles.roomBookingItem}>
        <View style={styles.libraryIconContainer}>
          <LibraryIcon color={FPT_ORANGE_COLOR} />
        </View>
        <View style={styles.roomBookingDetail}>
          <Text style={styles.roomText}>Library Room</Text>
          <Text style={styles.roomCodeOuterText}>
            Room Name: {props.item.roomName}
          </Text>
          <Text
            style={{
              fontSize: 18,
            }}
          >
            Time:
            <Text
              style={{
                fontWeight: '600',
              }}
            >
              {props.item.slotName} ({props.item.timeStart.slice(0, 5)} -{' '}
              {props.item.timeEnd.slice(0, 5)})
            </Text>
          </Text>
        </View>
      </View>
      <View style={styles.roomBookActionContainer}>
        <TouchableOpacity
          onPress={() => props.handleAddWishlist()}
          style={styles.addToWishListContainer}
        >
          <View style={styles.addToWishListButtonContainer}>
            <HeartIcon color={PINK} />
            <Text style={styles.addToWishListButtonText}>Add to wish list</Text>
          </View>
        </TouchableOpacity>

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

export default ChooseSlotItem;
