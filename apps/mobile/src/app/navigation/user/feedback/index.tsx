import React from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigator, StackScreen } from '@app/utils';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import FeedbackScreen from '../../../screens/user/feedback';
import { FEEDBACK_INITIAL_SCREEN } from '../../../route';
import SuccessfullySentFeedback from '../../../screens/track-feedback/successfully-sent-feedback';

const FeedbackNavigator: React.FC<any> = () => {
  const navigate = useAppNavigation();

  return (
    <StackNavigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={FEEDBACK_INITIAL_SCREEN}
    >
      <StackScreen name={FEEDBACK_INITIAL_SCREEN} component={FeedbackScreen} />
      <StackScreen
        name="SUCCESSFULLY_SENT_FEEDBACK"
        component={SuccessfullySentFeedback}
      />
    </StackNavigator>
  );
};

const styles = StyleSheet.create({});

export default FeedbackNavigator;
