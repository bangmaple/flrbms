import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppNavigation } from '../../hooks/use-app-navigation.hook';
import Success from '../../icons/success-sent-feedback.svg';
import { deviceHeight, deviceWidth } from '../../utils/device';
import {
  BLACK,
  FPT_ORANGE_COLOR,
  INPUT_GRAY_COLOR,
  WHITE,
} from '@app/constants';
import { HomeIcon } from 'react-native-heroicons/outline';

const SuccessfullySentFeedback: React.FC<any> = () => {
  const navigate = useAppNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingVertical: 100,
          }}
        >
          <Success width={deviceWidth / 1.5} height={deviceHeight / 3} />
          <Text
            style={{
              paddingVertical: 6,

              paddingHorizontal: 10,
              color: BLACK,
              fontWeight: '500',
              fontSize: deviceWidth / 20,
              textAlign: 'center',
            }}
          >
            Successfully sent the feedback!
          </Text>
          <Text
            style={{
              paddingVertical: 6,
              paddingHorizontal: 10,
              color: BLACK,
              fontWeight: '500',
              fontSize: deviceWidth / 20,
              textAlign: 'center',
            }}
          >
            Our librarians has received your feedback ^^
          </Text>
        </View>

        <View
          style={{
            height: 80,
            backgroundColor: WHITE,
            borderTopColor: INPUT_GRAY_COLOR,
            borderTopWidth: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => navigate.replace('MAIN')}
            style={{
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: FPT_ORANGE_COLOR,
              width: deviceWidth / 1.5,
              height: 50,
              borderRadius: 8,
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            <HomeIcon color={WHITE} size={deviceWidth / 14} />
            <Text
              style={{
                fontWeight: '600',
                fontSize: deviceWidth / 19,
                color: WHITE,
              }}
            >
              Back to home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

});

export default SuccessfullySentFeedback;
