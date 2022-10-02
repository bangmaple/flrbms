import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useAppNavigation } from '../../hooks/use-app-navigation.hook';

export const RoomBookingFail: React.FC = () => {
  const navigate = useAppNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      ></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
