import React, { useRef } from 'react';
import {
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet,
  VirtualizedList,
} from 'react-native';
import { useAppDispatch } from '../../hooks/use-app-dispatch.hook';
import TrackBookingRoomFilter from './filter';
import RoomBookingFeedbackItem from './track-room-booking-feedback-item';
import { useAppSelector } from '../../hooks/use-app-selector.hook';
import TrackRoomBookingFeedbackNotFound from './not-found';
import { fetchRoomBookingFeedbacks } from '../../redux/features/room-booking-feedback/thunk/fetch-all-room-booking-feedbacks.thunk';
import TrackRoomBookingFeedbackFilter from './filter';

const TrackRoomBookingFeedback: React.FC<any> = () => {
  const dispatch = useAppDispatch();

  const roomBookingFeedbacks = useAppSelector(
    (state) => state.roomBookingFeedback.roomBookingFeedbacks
  );

  const filterRef =
    useRef<React.ElementRef<typeof TrackBookingRoomFilter>>(null);

  const handleFilterSearch = () => {
    dispatch(fetchRoomBookingFeedbacks(filterRef.current))
      .unwrap()
      .catch((e) => alert(JSON.stringify(e)));
  };

  const TrackRoomBookingFeedbackList = () => {
    return (
      <VirtualizedList
        showsVerticalScrollIndicator={false}
        data={roomBookingFeedbacks}
        style={{
          paddingTop: 10,
          marginBottom: 20,
        }}
        getItemCount={(data) => data.length}
        getItem={(data, index) => data[index]}
        renderItem={(item: ListRenderItemInfo<FeedbackFilterResponse>) => (
          <RoomBookingFeedbackItem key={item.index} item={item.item} />
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TrackRoomBookingFeedbackFilter
        ref={filterRef}
        handleFilterSearch={() => handleFilterSearch()}
      />
      {roomBookingFeedbacks?.length < 1 ? (
        <TrackRoomBookingFeedbackNotFound />
      ) : (
        <TrackRoomBookingFeedbackList />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default TrackRoomBookingFeedback;
