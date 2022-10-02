import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  VirtualizedList,
} from 'react-native';
import { deviceHeight, deviceWidth } from '../../../../utils/device';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import {
  ChevronLeftIcon,
  DeviceMobileIcon,
} from 'react-native-heroicons/outline';
import { useAppNavigation } from '../../../../hooks/use-app-navigation.hook';
import { useAppSelector } from '../../../../hooks/use-app-selector.hook';

const devices = [
  {
    id: 1,
    name: 'Phone',
  },
  {
    id: 2,
    name: 'Phone',
  },
  {
    id: 3,
    name: 'Phone',
  },
  {
    id: 4,
    name: 'Phone',
  },
  {
    id: 5,
    name: 'Phone',
  },
  {
    id: 6,
    name: 'Phone',
  },
  {
    id: 7,
    name: 'Laptop',
  },
];

const ListDevice: React.FC<any> = () => {
  const navigate = useAppNavigation();
  const devices = useAppSelector(state => state.roomBooking.currentCheckinInformation.devices)

  const Device: React.FC<any> = (props) => {
    return (
      <View
        style={{
          height: 100,
          width: deviceWidth / 1.1,
          borderRadius: 8,
          backgroundColor: WHITE,
          marginTop: 20,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
          }}
        >
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginLeft: 10,
            }}
          >
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: FPT_ORANGE_COLOR,
                borderRadius: 50,
                height: 50,
                width: 50,
              }}
            >
              <DeviceMobileIcon size={deviceWidth / 10} color={WHITE} />
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontSize: deviceWidth / 23,
                fontWeight: '600',
              }}
            >
              {props.item.deviceName}
            </Text>
            <Text
              style={{
                fontSize: deviceWidth / 26,
                fontWeight: '400',
              }}
            >
              Device type
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <VirtualizedList
            style={{
              height: deviceHeight / 1.4,
            }}
            showsVerticalScrollIndicator={false}
            data={devices}
            getItemCount={(data) => data.length}
            getItem={(data, index) => data[index]}
            renderItem={(item) => <Device key={item.index} item={item.item} />}
          />
        </View>
        <View
          style={{
            display: 'flex',
            height: 80,
            backgroundColor: WHITE,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => navigate.pop()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: FPT_ORANGE_COLOR,
              height: 50,
              width: deviceWidth / 1.35,
              borderRadius: 8,
              flexDirection: 'row',
            }}
          >
            <ChevronLeftIcon color={WHITE} size={deviceWidth / 15} />
            <Text
              style={{
                color: WHITE,
                fontSize: deviceWidth / 19,
                fontWeight: '600',
                marginLeft: 10,
              }}
            >
              Go back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default ListDevice;
