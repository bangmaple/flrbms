import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useAppNavigation } from '../../hooks/use-app-navigation.hook';
import { useAppDispatch } from '../../hooks/use-app-dispatch.hook';

const RoomCheckout1: React.FC = () => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  return (
    <SafeAreaView>
      <ScrollView>
        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

});

export default RoomCheckout1;
