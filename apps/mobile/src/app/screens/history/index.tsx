import React, { useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChatAlt2Icon, LibraryIcon } from 'react-native-heroicons/outline';
import Divider from '../../components/text/divider';
import { BLACK, LIGHT_GRAY, WHITE } from '@app/constants';
import { useAppNavigation } from '../../hooks/use-app-navigation.hook';
import { deviceWidth } from '../../utils/device';

const HistoryScreen: React.FC = (props) => {
  const scrollViewRef = useRef<null | ScrollView>(null);
  const navigate = useAppNavigation();

  return (
    <SafeAreaView>
      <ScrollView
        ref={(ref) => {
          scrollViewRef.current = ref;
        }}
        contentInsetAdjustmentBehavior="automatic"
        style={{
          height: 400,
        }}
      >
        <View style={[styles.container]}>
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              backgroundColor: WHITE,
              display: 'flex',
              flexDirection: 'column',
              height: 130,
              borderRadius: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => navigate.navigate('BOOKING_REQUEST_HISTORY')}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: LIGHT_GRAY,
                  padding: 8,
                  borderRadius: 10,
                  marginRight: 15,
                }}
              >
                <LibraryIcon color={BLACK} />
              </View>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 20,
                  color: BLACK,
                }}
              >
                Booking Request History
              </Text>
            </TouchableOpacity>
            <Divider num={deviceWidth / 10} />
            <TouchableOpacity
              onPress={() => navigate.navigate('FeedbackHistory')}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                margin: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: LIGHT_GRAY,
                  padding: 8,
                  borderRadius: 10,
                  marginRight: 15,
                }}
              >
                <ChatAlt2Icon color={BLACK} />
              </View>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 20,
                  color: BLACK,
                }}
              >
                Feedback History
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
});

export default HistoryScreen;
