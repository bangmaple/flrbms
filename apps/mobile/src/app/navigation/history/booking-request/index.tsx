import React from 'react';
import { StackNavigator, StackScreen } from '@app/utils';
import BookingRequestHistory from '../../../screens/history/booking-request-history';

const BookingRequestHistoryNavigator: React.FC<any> = () => {
  return (
    <StackNavigator initialRouteName="HISTORY_PAGE">
      <StackScreen name="HISTORY_PAGE" component={BookingRequestHistory} />
    </StackNavigator>
  );
};

export default BookingRequestHistoryNavigator;
