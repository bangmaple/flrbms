import React from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigator, StackScreen } from '@app/utils';
import NotificationScreen from '../../../screens/notification';

const NotificationNavigator: React.FC<any> = () => {
  return (
    <StackNavigator initialRouteName="NOTIFICATION_SCREEN">
      <StackScreen name="NOTIFICATION_SCREEN" component={NotificationScreen} />
    </StackNavigator>
  );
};

const styles = StyleSheet.create({});

export default NotificationNavigator;
