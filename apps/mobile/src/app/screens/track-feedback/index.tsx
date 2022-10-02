import React, { useRef } from 'react';
import {
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet,
  VirtualizedList,
} from 'react-native';
import { useAppDispatch } from '../../hooks/use-app-dispatch.hook';
import TrackBookingRoomFilter from './filter';
import TrackFeedbackFilter from './filter';
import FeedbackItem from './track-feedback-item';
import { useAppSelector } from '../../hooks/use-app-selector.hook';
import TrackBookingRoomNotFound from './not-found';
import { fetchFeedbacks } from '../../redux/features/feedback/thunk/fetch-feedbacks.thunk';

const TrackFeedbackScreen: React.FC<any> = () => {
  const dispatch = useAppDispatch();

  const feedbacks = useAppSelector((state) => state.feedback.feedbacks);

  const filterRef =
    useRef<React.ElementRef<typeof TrackBookingRoomFilter>>(null);

  const handleFilterSearch = () => {
    dispatch(fetchFeedbacks(filterRef.current))
      .unwrap()
      .catch((e) => alert(JSON.stringify(e)));
  };

  const TrackBookingRoomList = () => {
    return (
      <VirtualizedList
        showsVerticalScrollIndicator={false}
        data={feedbacks}
        style={{
          paddingTop: 10,
          marginBottom: 20,
        }}
        getItemCount={(data) => data.length}
        getItem={(data, index) => data[index]}
        renderItem={(item: ListRenderItemInfo<FeedbackFilterResponse>) => (
          <FeedbackItem key={item.index} item={item.item} />
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TrackFeedbackFilter
        ref={filterRef}
        handleFilterSearch={() => handleFilterSearch()}
      />
      {feedbacks?.length < 1 ? (
        <TrackBookingRoomNotFound />
      ) : (
        <TrackBookingRoomList />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default TrackFeedbackScreen;
