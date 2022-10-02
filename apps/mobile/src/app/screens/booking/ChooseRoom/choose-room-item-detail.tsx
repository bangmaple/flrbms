import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BLACK, GRAY, WHITE } from '@app/constants';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';
import { deviceWidth } from '../../../utils/device';
import dayjs from 'dayjs';

interface ChooseRoomItemDetailProps {
  roomId: string;
}

const ChooseRoomItemDetail: React.FC<ChooseRoomItemDetailProps> = (props) => {
  const room = useAppSelector((state) => state.room.room);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ScrollView
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: BLACK,
              fontSize: deviceWidth / 19,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            Room {room.name}
          </Text>

          <View>
            <Text
              style={{
                color: GRAY,
                fontSize: deviceWidth / 24,
                fontWeight: '600',
              }}
            >
              IMAGE
            </Text>
            <View
              style={{
                display: 'flex',
                height: 150,
                width: deviceWidth / 1.05,
                backgroundColor: WHITE,
                borderRadius: 8,
              }}
            ></View>
          </View>

          <View>
            <Text
              style={{
                color: GRAY,
                fontSize: deviceWidth / 24,
                fontWeight: '600',
              }}
            >
              LIBRARY ROOM TYPE
            </Text>
            <View
              style={{
                display: 'flex',
                height: 40,
                width: deviceWidth / 1.05,
                backgroundColor: WHITE,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: BLACK,
                  fontWeight: '500',
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {room.type}
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                color: GRAY,
                fontSize: deviceWidth / 24,
                fontWeight: '600',
              }}
            >
              DESCRIPTION
            </Text>
            <View
              style={{
                display: 'flex',
                height: 120,
                width: deviceWidth / 1.05,
                backgroundColor: WHITE,
                borderRadius: 8,
                flexWrap: 'wrap',
              }}
            >
              <Text
                style={{
                  color: BLACK,
                  fontWeight: '500',
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {room.description}
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                color: GRAY,
                fontSize: deviceWidth / 24,
                fontWeight: '600',
              }}
            >
              CREATED AT
            </Text>
            <View
              style={{
                display: 'flex',
                height: 40,
                width: deviceWidth / 1.05,
                backgroundColor: WHITE,
                borderRadius: 8,
                flexWrap: 'wrap',
              }}
            >
              <Text
                style={{
                  color: BLACK,
                  fontWeight: '500',
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {dayjs(room.createdAt).format('DD/MM/YYYY HH:mm:ss')}
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                color: GRAY,
                fontSize: deviceWidth / 24,
                fontWeight: '600',
              }}
            >
              CREATED BY
            </Text>
            <View
              style={{
                display: 'flex',
                height: 40,
                width: deviceWidth / 1.05,
                backgroundColor: WHITE,
                borderRadius: 8,
                flexWrap: 'wrap',
              }}
            >
              <Text
                style={{
                  color: BLACK,
                  fontWeight: '500',
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {room.createdBy}
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                color: GRAY,
                fontSize: deviceWidth / 24,
                fontWeight: '600',
              }}
            >
              UPDATED AT
            </Text>
            <View
              style={{
                display: 'flex',
                height: 40,
                width: deviceWidth / 1.05,
                backgroundColor: WHITE,
                borderRadius: 8,
                flexWrap: 'wrap',
              }}
            >
              <Text
                style={{
                  color: BLACK,
                  fontWeight: '500',
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {dayjs(room.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                color: GRAY,
                fontSize: deviceWidth / 24,
                fontWeight: '600',
              }}
            >
              UPDATED BY
            </Text>
            <View
              style={{
                display: 'flex',
                height: 40,
                width: deviceWidth / 1.05,
                backgroundColor: WHITE,
                borderRadius: 8,
                flexWrap: 'wrap',
              }}
            >
              <Text
                style={{
                  color: BLACK,
                  fontWeight: '500',
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {room.updatedBy}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default ChooseRoomItemDetail;
