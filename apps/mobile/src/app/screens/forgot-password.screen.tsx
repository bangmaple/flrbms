import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useAppNavigation } from '../hooks/use-app-navigation.hook';
import { useAppDispatch } from '../hooks/use-app-dispatch.hook';

const ForgotPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useAppNavigation();
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

export default ForgotPassword;
