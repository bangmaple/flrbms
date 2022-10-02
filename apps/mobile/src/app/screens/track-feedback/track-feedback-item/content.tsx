import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import { deviceWidth } from '../../../utils/device';
import { BLACK, GRAY } from '@app/constants';

interface TrackBookingRequestItemContentProps {
  item: FeedbackFilterResponse;
}

const TrackFeedbackItemContent: React.FC<
  TrackBookingRequestItemContentProps
> = (props) => {
  const SlotRender = () => {
    if (props.item.createdAt === props.item.createdAt) {
      return <Text style={styles.textValue}>Slot {props.item.createdAt}</Text>;
    }
    return (
      <Text style={styles.textValue}>
        Slot {props.item.createdAt} - Slot {props.item.createdAt}
      </Text>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.rowRender}>
        <Text style={styles.textTitle}>Sent by:</Text>
        <Text style={styles.textValue}>{props.item.createdByName}</Text>
      </View>
      <View style={[{ marginTop: 10 }, styles.rowRender]}>
        <Text style={styles.textTitle}>Sent at:</Text>
        <Text style={styles.textValue}>
          {dayjs(props.item.createdAt).format('HH:mm DD/MM/YYYY')}
        </Text>
      </View>
      <View style={[{ marginTop: 10 }, styles.rowRender]}>
        <Text style={styles.textTitle}>Feedback type:</Text>
        <Text style={styles.textValue}>{props.item.feedbackTypeName ?? "Other"}</Text>
      </View>
      {props.item.status !== "PENDING" ? <View style={[{ marginTop: 10 }, styles.rowRender]}>
        <Text style={styles.textTitle}>{props.item.status === "REJECTED" ? "Rejected" : "Resolved"} at:</Text>
        <Text style={styles.textValue}>
          {dayjs(props.item.status === "REJECTED" ? props.item.rejectedAt : props.item.resolvedAt).format('DD/MM/YYYY')}
        </Text>
      </View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  rowRender: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textTitle: {
    fontWeight: '600',
    fontSize: deviceWidth / 30,
    color: BLACK,
  },
  textValue: {
    marginLeft: 5,
    fontWeight: '400',
    fontSize: deviceWidth / 30,
    color: GRAY,
  },
});

export default TrackFeedbackItemContent;
