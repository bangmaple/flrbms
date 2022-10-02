import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import { deviceWidth } from '../../utils/device';
import { useAppNavigation } from '../../hooks/use-app-navigation.hook';
import { useAppDispatch } from '../../hooks/use-app-dispatch.hook';

const RoomInBookingDetail: React.FC = () => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        <ScrollView></ScrollView>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: WHITE,
            height: 70,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: FPT_ORANGE_COLOR,
              width: deviceWidth / 1.25,
              height: 50,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: WHITE,
                fontSize: deviceWidth / 22,
                fontWeight: '600',
              }}
            >
              Checkout this room now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

});

export default RoomInBookingDetail;
