import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as IconOutline from 'react-native-heroicons/outline';
import * as Icon from 'react-native-heroicons/solid';
import { BLACK, WHITE } from '@app/constants';

const QRScan = () => {
  const [whatsNextYCoord, setWhatsNextYCoord] = useState<number>(0);
  const scrollViewRef = useRef<null | ScrollView>(null);
  return (
    <SafeAreaView>
      <ScrollView
        ref={(ref) => {
          scrollViewRef.current = ref;
        }}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
      >
        <View style={[styles.header]}>
          <View style={[styles.headerTitle]}>
            <Text>Cac</Text>
            <IconOutline.UserCircleIcon color="black" size={40} />
          </View>
          <View style={[styles.headerBody]}>
            <Icon.UserCircleIcon size={80} color="#f06e28" />
            <Text style={[styles.userAvatarname]}>Ngô Nguyên Bằng</Text>
            <Text style={[styles.userEmail]}>bangnnse140937@fpt.edu.vn</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRScan;

export const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: WHITE,
  },
  header: {
    display: 'flex',
    marginLeft: 5,
    marginRight: 5,
    height: 200
  },
  userInfoIcon: {
    color: BLACK,
    fontSize: 20
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarname: {
    fontWeight: '500',
  },
  userEmail: {
    color: 'gray',
    fontSize: 12
  }
});
