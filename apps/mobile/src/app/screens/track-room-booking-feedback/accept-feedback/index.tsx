import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import {
  BLACK,
  CANCELLED,
  CHECKED_OUT,
  FPT_ORANGE_COLOR,
  GRAY,
  INPUT_GRAY_COLOR,
  LIGHT_GRAY,
  WHITE,
} from '@app/constants';
import { deviceWidth } from '../../../utils/device';
import {
  ChevronLeftIcon,
  ExclamationIcon,
} from 'react-native-heroicons/outline';
import Divider from '../../../components/text/divider';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';
import dayjs from 'dayjs';
import ResolveFeedbackFooter from './footer';
import AlertModal from '../../../components/modals/alert-modal.component';
import { resolveFeedback } from '../../../redux/features/feedback/thunk/resolve-feedback.thunk';
import { cancelFeedback } from '../../../redux/features/feedback/thunk/cancel-feedback.thunk';

const AcceptRoomFeedback: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const navigate = useAppNavigation();
  const { roomBookingFeedback } = useAppSelector(
    (state) => state.roomBookingFeedback
  );
  const authUser = useAppSelector((state) => state.auth.authUser);

  const handleResolveAction = () => {
    setResolveModalShown(!isResolveModalShown);
  };

  const [isResolveModalShown, setResolveModalShown] = useState(false);
  const [isCancelModalShown, setCancelModalShown] = useState(false);

  const handleCancelAction = () => {
    setCancelModalShown(!isCancelModalShown);
  };

  const renderFooter = () => {
    if (authUser.role === 'Staff' || authUser.role === 'Librarian') {
      return <></>;
    }
    return roomBookingFeedback.status !== 'REJECTED' &&
      roomBookingFeedback.status !== 'RESOLVED' ? (
      <ResolveFeedbackFooter
        handleReject={() => handleCancelAction()}
        handleAccept={() => handleResolveAction()}
      />
    ) : null;
  };

  const resolveFeedbackModal =
    useRef<React.ElementRef<typeof ResolveAlertModalRef>>();
  const rejectFeedbackModal =
    useRef<React.ElementRef<typeof CancelAlertModalRef>>();

  const handleAttemptResolveFeedback = () => {
    if (typeof resolveFeedbackModal.current.message !== 'undefined') {
      dispatch(
        resolveFeedback({
          id: roomBookingFeedback.id,
          replyMessage: resolveFeedbackModal.current
            ? resolveFeedbackModal.current.message
            : undefined,
        })
      )
        .unwrap()
        .then(() => setResolveModalShown(!isResolveModalShown))
        .then(() => navigate.replace('TRACK_FEEDBACK_ROUTE'))
        .catch((e) => alert(JSON.stringify(e)));
    } else {
      alert('Please input message!');
    }
  };

  const handleAttemptCancelFeedback = () => {
    dispatch(
      cancelFeedback({
        id: roomBookingFeedback.id,
        replyMessage: rejectFeedbackModal.current
          ? rejectFeedbackModal.current.message
          : undefined,
      })
    )
      .unwrap()
      .then(() => setCancelModalShown(!isCancelModalShown))
      .then(() => navigate.replace('TRACK_FEEDBACK_ROUTE'))
      .catch((e) => alert(JSON.stringify(e)));
  };

  const CancelAlertModal: React.ForwardRefRenderFunction<
    { message: string },
    any
  > = (props, ref) => {
    const [message, setMessage] = useState<string>();

    useImperativeHandle(ref, () => ({
      message,
    }));

    return (
      <AlertModal
        height={300}
        width={deviceWidth / 1.1}
        isOpened={isCancelModalShown}
        toggleShown={() => setCancelModalShown(!isCancelModalShown)}
      >
        <View
          style={{
            display: 'flex',
            flex: 1,
            flexGrow: 0.9,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontWeight: '600',
              fontSize: deviceWidth / 21,
              color: BLACK,
            }}
          >
            Please input reject reason
          </Text>
          <TextInput
            onChangeText={(e) => setMessage(e)}
            value={message}
            style={{
              backgroundColor: LIGHT_GRAY,
              width: deviceWidth / 1.2,
              borderRadius: 8,
              textAlignVertical: 'top',
              paddingHorizontal: 10,
            }}
            placeholder="Please share your reject message..."
            multiline
            numberOfLines={8}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: deviceWidth / 1.1,
            }}
          >
            <TouchableOpacity
              onPress={() => setCancelModalShown(!isCancelModalShown)}
              style={{
                height: 40,
                width: deviceWidth / 2.8,
                borderWidth: 2,
                borderColor: FPT_ORANGE_COLOR,
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: deviceWidth / 23,
                  fontWeight: '500',
                  color: FPT_ORANGE_COLOR,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAttemptCancelFeedback()}
              style={{
                height: 40,
                width: deviceWidth / 2.2,
                backgroundColor: FPT_ORANGE_COLOR,
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: deviceWidth / 23,
                  color: WHITE,
                  fontWeight: '500',
                }}
              >
                Attempt Reject
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </AlertModal>
    );
  };

  const CancelAlertModalRef = forwardRef(CancelAlertModal);

  const ResolveAlertModal: React.ForwardRefRenderFunction<
    { message: string },
    any
  > = (props, ref) => {
    const [message, setMessage] = useState<string>();

    useImperativeHandle(ref, () => ({
      message: message,
    }));

    return (
      <AlertModal
        height={300}
        width={deviceWidth / 1.1}
        isOpened={isResolveModalShown}
        toggleShown={() => setResolveModalShown(!isResolveModalShown)}
      >
        <View
          style={{
            display: 'flex',
            flex: 1,
            flexGrow: 0.9,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontWeight: '600',
              fontSize: deviceWidth / 21,
              color: BLACK,
            }}
          >
            Please input resolve message
          </Text>

          <TextInput
            value={message}
            onChangeText={(e) => setMessage(e)}
            style={{
              backgroundColor: LIGHT_GRAY,
              width: deviceWidth / 1.2,
              borderRadius: 8,
              textAlignVertical: 'top',
              paddingHorizontal: 10,
            }}
            placeholder="Please share your resolve message..."
            multiline
            numberOfLines={8}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: deviceWidth / 1.1,
            }}
          >
            <TouchableOpacity
              onPress={() => setResolveModalShown(!isResolveModalShown)}
              style={{
                height: 40,
                width: deviceWidth / 2.8,
                borderWidth: 2,
                borderColor: FPT_ORANGE_COLOR,
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: deviceWidth / 23,
                  fontWeight: '500',
                  color: FPT_ORANGE_COLOR,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAttemptResolveFeedback()}
              style={{
                height: 40,
                width: deviceWidth / 2.2,
                backgroundColor: FPT_ORANGE_COLOR,
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: deviceWidth / 23,
                  color: WHITE,
                  fontWeight: '500',
                }}
              >
                Attempt resolve
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </AlertModal>
    );
  };

  const ResolveAlertModalRef = forwardRef(ResolveAlertModal);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: WHITE }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigate.pop()}>
            <ChevronLeftIcon
              style={styles.backNavigation}
              size={deviceWidth / 14}
              color={FPT_ORANGE_COLOR}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>
            {roomBookingFeedback.status !== 'RESOLVED' &&
            roomBookingFeedback.status !== 'REJECTED'
              ? 'Incoming feedback'
              : 'Review feedback'}
          </Text>
        </View>
        <ScrollView
          style={{
            backgroundColor: WHITE,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              paddingHorizontal: 20,
            }}
          >
            {authUser.role !== 'Staff' &&
            roomBookingFeedback.status !== 'RESOLVED' &&
            roomBookingFeedback.status !== 'REJECTED' ? (
              <View style={styles.warningMessageContainer}>
                <ExclamationIcon
                  color={FPT_ORANGE_COLOR}
                  size={deviceWidth / 14}
                  style={styles.warningMessageIcon}
                />
                <Text style={styles.warningMessageText}>
                  Read the feedback carefully before proceeding the next step!
                </Text>
              </View>
            ) : null}
            {authUser.role !== 'Staff' &&
            roomBookingFeedback.status !== 'RESOLVED' &&
            roomBookingFeedback.status !== 'REJECTED' ? (
              <Text style={styles.textStatus}>
                {roomBookingFeedback.createdBy} sent the feedback
              </Text>
            ) : null}
            <Text style={styles.informationHeaderTitle}>
              FEEDBACK INFORMATION
            </Text>
            <View style={styles.bookingInformationContainer}>
              <View style={styles.dataRowContainer}>
                <Text style={styles.titleText}>Created By</Text>
                <Text style={styles.valueText}>
                  {roomBookingFeedback.createdBy}
                </Text>
              </View>
              <Divider num={deviceWidth / 10} />

              <View style={styles.dataRowContainer}>
                <Text style={styles.titleText}>Created at</Text>
                <Text style={styles.valueText}>
                  {dayjs(new Date(roomBookingFeedback.createdAt)).format(
                    'HH:mm DD/MM/YYYY'
                  )}
                </Text>
              </View>

              <Divider num={deviceWidth / 10} />

              <View style={styles.dataRowContainer}>
                <Text style={styles.titleText}>Feedback type</Text>
                <Text style={styles.valueText}>
                  {roomBookingFeedback.feedbackType}
                </Text>
              </View>
            </View>

            {roomBookingFeedback.status === 'RESOLVED' ||
            roomBookingFeedback.status === 'REJECTED' ? (
              <View>
                <Text style={styles.informationHeaderTitle}>
                  FEEDBACK STATUS
                </Text>
                <View
                  style={[
                    styles.bookingInformationContainer,
                    { marginBottom: 20 },
                  ]}
                >
                  <View style={styles.dataRowContainer}>
                    <Text style={styles.titleText}>Status</Text>
                    <Text style={styles.valueText}>
                      {roomBookingFeedback.status}
                    </Text>
                  </View>

                  <>
                    <Divider num={deviceWidth / 10} />
                    <View style={styles.dataRowContainer}>
                      <Text style={styles.titleText}>Reply Message</Text>
                      <Text style={styles.valueText}>
                        {roomBookingFeedback.replyMess}
                      </Text>
                    </View>
                  </>
                </View>
              </View>
            ) : null}

            <View>
              <Text style={styles.informationHeaderTitle}>
                MORE INFORMATION
              </Text>
              <View
                style={[
                  styles.bookingInformationContainer,
                  { marginBottom: 20 },
                ]}
              >
                <>
                  <View style={styles.dataRowContainer}>
                    <Text style={styles.titleText}>Message</Text>
                    <Text style={styles.valueText}>
                      {roomBookingFeedback.feedbackMess}
                    </Text>
                  </View>
                </>
              </View>
            </View>
          </View>
        </ScrollView>
        {renderFooter()}
      </View>
      <ResolveAlertModalRef ref={resolveFeedbackModal} />
      <CancelAlertModalRef ref={rejectFeedbackModal} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backNavigation: {
    marginTop: -10,
    marginLeft: 20,
  },
  bookingInformationContainer: {
    marginTop: 10,
    display: 'flex',
    width: deviceWidth / 1.1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: INPUT_GRAY_COLOR,
    alignSelf: 'center',
  },
  textStatus: {
    fontWeight: '500',
    fontSize: deviceWidth / 23,
    alignSelf: 'center',
    marginTop: 10,
    textAlign: 'center',
  },
  headerTitleText: {
    color: BLACK,
    fontWeight: '600',
    fontSize: deviceWidth / 18,
    marginBottom: 20,
    marginTop: 10,
    marginLeft: 30,
  },
  warningMessageContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: FPT_ORANGE_COLOR,
  },
  warningMessageIcon: {
    marginTop: 10,
    marginLeft: 10,
  },
  warningMessageText: {
    color: FPT_ORANGE_COLOR,
    fontSize: deviceWidth / 25,
    fontWeight: '600',
    margin: 10,
  },
  informationHeaderTitle: {
    paddingTop: 20,
    color: GRAY,
    fontSize: deviceWidth / 23,
    fontWeight: '600',
  },
  dataRowContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    flexWrap: 'wrap',
  },
  titleText: {
    color: GRAY,
    fontWeight: '400',
    fontSize: deviceWidth / 23,
  },
  valueText: {
    color: BLACK,
    fontSize: deviceWidth / 23,
    fontWeight: '500',
  },
  signatureView: {
    marginTop: 10,
    display: 'flex',
    width: deviceWidth / 1.1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: INPUT_GRAY_COLOR,
    alignSelf: 'center',
    height: 150,
  },
  footer: {
    height: 80,
    backgroundColor: WHITE,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: INPUT_GRAY_COLOR,
    borderTopWidth: 1,
  },
  cancelBookingRequestButton: {
    height: 50,
    width: deviceWidth / 1.35,
    borderRadius: 8,
    backgroundColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cancelBookingRequestButtonText: {
    fontWeight: '600',
    fontSize: deviceWidth / 20,
    color: WHITE,
  },
});

export default AcceptRoomFeedback;
