import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BLACK, FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import HomeScreenSectionCarousel from './carousel';
import HomeScreenSectionRoomBooking from './room-booking';
import HomeScreenSectionRoomCheckout from './room-checkout';
import HomeScreenSectionTrackBookingRoom from './track-booking-room';
import HomeScreenSectionResolveFeedback from './resolve-feedbacks';
import { PencilIcon, ViewGridIcon } from 'react-native-heroicons/outline';
import { deviceWidth } from '../../../utils/device';
import { boxShadow } from '../../../utils/box-shadow.util';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import HomeScreenSectionRoomCheckin from './room-checkin';
import TrackRoomBookingFeedbackNavigator from '../../../navigation/home/track-room-booking-feedback';
import HomeScreenSectionTrackRoomBookingFeedback from './track-room-booking-feedbacks';
import HomeScreenSectionRoomWishlist from './room-wishlist';

const HomeScreenSection: React.FC<any> = () => {
  const navigate = useAppNavigation();
  return (
    <View style={[boxShadow(styles), styles.container]}>
      <HomeScreenSectionCarousel />
      <View style={styles.quickAccess}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 10,
            marginBottom: 10,
            marginRight: 10,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <ViewGridIcon color={BLACK} size={deviceWidth / 14} />
            <Text style={styles.quickAccessText}>Quick Access</Text>
          </View>
        </View>

        <View style={styles.quickAccessButtons}>
          <HomeScreenSectionRoomBooking />
          <HomeScreenSectionRoomCheckout />
          <HomeScreenSectionTrackBookingRoom />
          <HomeScreenSectionResolveFeedback />
          <HomeScreenSectionTrackRoomBookingFeedback />
          <HomeScreenSectionRoomCheckin />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    marginHorizontal: 12,
  },
  quickAccess: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: WHITE,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 8,
  },
  quickAccessText: {
    color: BLACK,
    fontWeight: '600',
    fontSize: 22,
    marginLeft: 10,
  },
  quickAccessButtons: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default HomeScreenSection;
