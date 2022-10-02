import React, { useEffect, useState } from 'react';
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
import FeedbackIcon from '../../../icons/feedback_1.svg';
import { deviceHeight, deviceWidth } from '../../../utils/device';
import { BLACK, FPT_ORANGE_COLOR, LIGHT_GRAY, WHITE } from '@app/constants';
import FeedbackFooter from './feedback.footer';
import SelectFeedbackTypes from './select-feedback-type';
import { fetchAllFeedBackTypes } from '../../../redux/features/feed-back-type/thunk/fetch-all-feed-back-types.thunk';
import FeedbackTypeModel from '../../../redux/models/feedback-type.model';
import { addNewFeedback } from '../../../redux/features/feedback/thunk/Add-new-feedback.thunk';
import AlertModal from '../../../components/modals/alert-modal.component';
import {
  ExclamationCircleIcon,
  ReplyIcon,
  XIcon,
} from 'react-native-heroicons/outline';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';

const FeedbackScreen: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const navigate = useAppNavigation();

  const [selectedFeedbackType, setSelectedFeedbackType] = useState<string>();
  const [selectedFeedbackTypeSelections, setSelectedFeedbackTypeSelections] =
    useState([]);
  const [descriptions, setDescriptions] = useState('');
  useEffect(() => {
    dispatch(fetchAllFeedBackTypes())
      .unwrap()
      .then((value) => {
        transformFeedbackTypeToFeedbackTypePicker(value);
      });
    return () => {
      setSelectedFeedbackTypeSelections([]);
    };
  }, []);

  const transformFeedbackTypeToFeedbackTypePicker = (
    value: FeedbackTypeModel[]
  ) => {
    const feedbackTypeSelections = value.map((feedbackType) => {
      return {
        value: feedbackType.id,
        label: feedbackType.name,
      };
    });
    setSelectedFeedbackTypeSelections(feedbackTypeSelections);
    handleSetFeedbackType(feedbackTypeSelections[0].value);
  };

  const handleSetFeedbackType = (value) => {
    if (!value) {
      return setSelectedFeedbackType('Feedback room');
    }
    setSelectedFeedbackType(value);
  };

  const attemptSendFeedback = () => {
    if (descriptions.length < 1) {
      alert('Please Share Your Experience');
      return
    } else {
      dispatch(
        addNewFeedback({
          message: descriptions,
          feedbackTypeId: selectedFeedbackType,
        })
      )
        .unwrap()
        .then(() => {
          navigate.navigate('SUCCESSFULLY_SENT_FEEDBACK');
        })
        .catch((e) => {
          alert('Failed while processing your request. Please try again.');
        });
    }
  };

  const handleSendFeedback = () => {
    setConfirmModalOpened(!isConfirmModalOpened);
  };

  const [isConfirmModalOpened, setConfirmModalOpened] =
    useState<boolean>(false);

  const ConfirmAlertModal = () => {
    return (
      <AlertModal
        isOpened={isConfirmModalOpened}
        height={140}
        width={deviceWidth / 1.1}
        toggleShown={() => setConfirmModalOpened(!isConfirmModalOpened)}
      >
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            flexGrow: 1,
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ExclamationCircleIcon
            size={deviceWidth / 9}
            color={FPT_ORANGE_COLOR}
          />
          <Text
            style={{
              fontSize: deviceWidth / 23,
              color: BLACK,
              fontWeight: '500',
            }}
          >
            Are you sure want to send this feedback?
          </Text>
          <View
            style={{
              flex: 1,
              flexGrow: 1,
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: deviceWidth / 1.2,
            }}
          >
            <TouchableOpacity
              onPress={() => setConfirmModalOpened(false)}
              style={{
                borderWidth: 2,
                borderColor: FPT_ORANGE_COLOR,
                borderRadius: 8,
                width: deviceWidth / 3.5,
                flexDirection: 'row',
                height: 40,
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              <XIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 16} />
              <Text
                style={{
                  color: FPT_ORANGE_COLOR,
                  fontSize: deviceWidth / 24,
                  fontWeight: '500',
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                attemptSendFeedback();
                setConfirmModalOpened(false);
              }}
              style={{
                backgroundColor: FPT_ORANGE_COLOR,
                borderRadius: 8,
                width: deviceWidth / 2.5,
                flexDirection: 'row',
                height: 40,
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              <ReplyIcon color={WHITE} size={deviceWidth / 16} />
              <Text
                style={{
                  color: WHITE,
                  fontSize: deviceWidth / 24,
                  fontWeight: '500',
                }}
              >
                Send!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </AlertModal>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: WHITE,
      }}
    >
      <ScrollView>
        <View style={styles.container}>
          <FeedbackIcon width={deviceWidth / 1.5} height={deviceHeight / 3.5} />
          <Text
            style={{
              color: BLACK,
              fontWeight: '600',
              fontSize: deviceWidth / 20,
              flexWrap: 'wrap',
              textAlign: 'center',
            }}
          >
            Share your experience at FPTU Library
          </Text>
          <View
            style={{
              marginTop: 20,
            }}
          >
            <View
              style={{
                marginBottom: 20,
              }}
            >
              <View>
                <SelectFeedbackTypes
                  feedbackTypesSelections={selectedFeedbackTypeSelections}
                  feedbackType={selectedFeedbackType}
                  handleSetFeedbackType={(value) =>
                    setSelectedFeedbackType(value)
                  }
                />
              </View>
            </View>

            <View
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                flexDirection: 'row',
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  color: BLACK,
                  fontWeight: '600',
                  fontSize: deviceWidth / 23,
                }}
              >
                At FPTU Library, your experience is precious to us!
              </Text>
            </View>
            <TextInput
              multiline
              numberOfLines={10}
              style={{
                alignSelf: 'center',
                paddingHorizontal: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: LIGHT_GRAY,
                width: deviceWidth / 1.05,
                height: deviceHeight / 6,
                backgroundColor: '#f2f2f2',
                textDecorationColor: BLACK,
                fontSize: deviceWidth / 25,
              }}
              placeholder="We want to know more about your experience"
              textAlignVertical={'top'}
              onChangeText={(value) => setDescriptions(value)}
              value={descriptions}
            />
          </View>
        </View>
      </ScrollView>
      <FeedbackFooter handlePress={() => handleSendFeedback()} />
      <ConfirmAlertModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default FeedbackScreen;
