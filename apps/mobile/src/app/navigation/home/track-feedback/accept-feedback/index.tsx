import React from 'react';
import { StackNavigator, StackScreen } from '@app/utils';
import SuccessfullyAcceptedBookingRequest from '../../../../screens/track-booking-room/accept-booking/success-accepted-booking-request';
import AcceptFeedback from '../../../../screens/track-feedback/accept-feedback';

const AcceptFeedbackNavigator: React.FC<any> = () => {
  return (
    <StackNavigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="ACCEPT_FEEDBACK"
    >
      <StackScreen name="ACCEPT_FEEDBACK" component={AcceptFeedback} />
      <StackScreen
        name="SUCCESSFULLY_ACCEPTED_FEEDBACK"
        component={SuccessfullyAcceptedBookingRequest}
      />
    </StackNavigator>
  );
};

export default AcceptFeedbackNavigator;
