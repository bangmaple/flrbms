import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { WHITE } from '@app/constants';
import { deviceWidth } from '../../../utils/device';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import TrackFeedbackItemContent from './content';
import TrackingBookingRequestItemNavigation from './navigation';
import { boxShadow } from '../../../utils/box-shadow.util';
import { fetchFeedbackById } from '../../../redux/features/feedback/thunk/fetch-feedback-by-id.thunk';

interface BookingRequestItemProps {
  item: FeedbackFilterResponse;
}
const FeedbackItem: React.FC<BookingRequestItemProps> = (props) => {
  const navigate = useAppNavigation();
  const dispatch = useAppDispatch();

  const handleFetchBookingRequest = (id: string) => {
    dispatch(fetchFeedbackById(id))
      .unwrap()
      .then(() => navigate.navigate('ACCEPT_FEEDBACK_ROUTE'))
      .catch(() => alert('Failed while fetching data'));
  };

  return (
    <TouchableOpacity
      onPress={() => handleFetchBookingRequest(props.item.id)}
      style={[boxShadow(styles), styles.container, {height: props.item.status !== "PENDING" ? 130 : 100}]}
    >
      <TrackFeedbackItemContent item={props.item} />
      <TrackingBookingRequestItemNavigation status={props.item.status} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    width: deviceWidth / 1.05,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

export default FeedbackItem;
