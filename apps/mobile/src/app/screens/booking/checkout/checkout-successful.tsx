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
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';
import {
  BLACK,
  FPT_ORANGE_COLOR,
  GRAY,
  INPUT_GRAY_COLOR,
  WHITE,
} from '@app/constants';
import { deviceHeight, deviceWidth } from '../../../utils/device';
import {
  ExclamationCircleIcon,
  HomeIcon,
  TicketIcon,
} from 'react-native-heroicons/outline';

import SuccessCheckOut from '../../../components/success-checkout.svg';
import StarRating from './rate';
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select';
import Divider from '../../../components/text/divider';
import SuccessfullyCheckedOutFeedback from './modal/successfully-checkout-feedback';
import { FormikValues, useFormik } from 'formik';
import { boxShadow } from '../../../utils/box-shadow.util';
import AlertModal from '../../../components/modals/alert-modal.component';
import { useAppDispatch } from '../../../hooks/use-app-dispatch.hook';
import { fetchAllFeedBackTypes } from '../../../redux/features/feed-back-type/thunk/fetch-all-feed-back-types.thunk';
import FeedbackTypeModel from '../../../redux/models/feedback-type.model';
import { addNewFeedbackAfterCheckout } from '../../../redux/features/feedback/thunk/Add-new-feedback-after-checkout.thunk';
import { useAppSelector } from '../../../hooks/use-app-selector.hook';

const CheckoutSuccessfully: React.FC<any> = () => {
  const navigate = useAppNavigation();
  const [rating, setRating] = useState<number>(0);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);
  const [isFeedbackSent, setFeedbackSent] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [selectedFeedbackTypeSelections, setSelectedFeedbackTypeSelections] =
    useState([]);
  const [selectedFeedbackType, setSelectedFeedbackType] = useState<string>();
  const { roomBookingCheckout } = useAppSelector((state) => state.roomBooking);

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
  const Header = () => {
    return (
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SuccessCheckOut
          height={deviceWidth / 1.75}
          width={deviceWidth / 1.75}
        />
        <Text
          style={{
            color: BLACK,
            fontWeight: '600',
            fontSize: deviceWidth / 20,
          }}
        >
          Successfully checked out the room
        </Text>
      </View>
    );
  };

  const handleSubmit = (values: FormikValues) => {
    if (!values.feedbackType) {
      return alert('Please select a feedback type!');
    }
    dispatch(
      addNewFeedbackAfterCheckout({
        message: values.description,
        rateNum: values.rateNum,
        feedbackType: values.feedbackType,
        bookingRoomId: roomBookingCheckout.id,
      })
    )
      .unwrap()
      .then(() => {
        setTimeout(() => alert('Feed Back Successful! Thank you for your feedback'), 1000);
        navigate.replace('MAIN')
      })
      .catch((e) => {
        alert(JSON.stringify(e));
      });
    // setFeedbackModalOpen(true);
  };

  const [isNotLeavingFeedbackModalOpened, setNotLeavingFeedbackModalOpened] =
    useState(false);

  const NotLeavingFeedbackAlertModal = () => {
    return (
      <AlertModal
        isOpened={isNotLeavingFeedbackModalOpened}
        height={deviceHeight / 4}
        width={deviceWidth / 1.2}
        toggleShown={() =>
          setNotLeavingFeedbackModalOpened(!isNotLeavingFeedbackModalOpened)
        }
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flex: 1,
            flexGrow: 1,
          }}
        >
          <ExclamationCircleIcon
            color={FPT_ORANGE_COLOR}
            size={deviceWidth / 9}
          />
          <Text
            style={{
              textAlign: 'center',
              paddingHorizontal: 10,
              color: BLACK,
              fontWeight: '500',
              fontSize: deviceWidth / 23,
            }}
          >
            Are you sure don't want to leave a feedback for us?
          </Text>

          <View>
            <TouchableOpacity
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                backgroundColor: FPT_ORANGE_COLOR,
                borderRadius: 8,
                width: deviceWidth / 2.3,
                height: 50,
              }}
              onPress={() => {
                navigate.replace('MAIN');
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: WHITE,
                  fontWeight: '600',
                  fontSize: deviceWidth / 23,
                  width: deviceWidth / 1.75,
                }}
              >
                Go Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </AlertModal>
    );
  };

  const handleNavigateHome = () => {
    if (!isFeedbackSent) {
      setNotLeavingFeedbackModalOpened(true);
    }
    //navigate.replace('MAIN');
  };

  const handleNavigateBookingRoom = () => {
    navigate.replace('ROOM_BOOKING');
  };

  const formik = useFormik({
    initialValues: {
      rateNum: 5,
      description: undefined,
      feedbackType: selectedFeedbackType,
    },
    onSubmit: (values) => handleSubmit(values),
  });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NotLeavingFeedbackAlertModal />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.wrapper}
        >
          <Header />

          <Divider num={deviceWidth / 8} />

          <View style={styles.itemContainer}>
            <Text style={styles.title}>Please rate our services</Text>
            <View style={[styles.ratingContainer, boxShadow(styles)]}>
              <StarRating
                rating={rating}
                setRating={(rate) => {
                  setRating(rate);
                }}
              />
            </View>
          </View>

          <View style={styles.itemContainer}>
            <Text style={styles.title}>TELL US MORE</Text>
            <TextInput
              style={[styles.description, boxShadow(styles)]}
              placeholder="Share your thought..."
              multiline
              numberOfLines={4}
              value={formik.values.description}
              onChangeText={formik.handleChange('description')}
            />
          </View>

          <View style={styles.itemContainer}>
            <Text style={styles.title}>FEEDBACK TYPE</Text>
            <RNPickerSelect
              placeholder={{}}
              value={formik.values.feedbackType}
              style={pickerStyle}
              onValueChange={(e) => formik.setFieldValue('feedbackType', e)}
              items={selectedFeedbackTypeSelections}
            />
          </View>

          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 30,
              height: 100,
            }}
          >
            {isFeedbackSent ? (
              <View style={[styles.submitFeedbackContainer, boxShadow(styles)]}>
                <Text
                  style={{
                    color: WHITE,
                    fontSize: deviceWidth / 19,
                    fontWeight: '600',
                  }}
                >
                  Submit Feedback
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => formik.submitForm()}
                style={[styles.submitFeedbackButton, boxShadow(styles)]}
              >
                <Text style={styles.submitFeedbackButtonText}>
                  Submit Feedback
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => handleNavigateBookingRoom()}
            style={styles.bookAnotherButton}
          >
            <TicketIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 15} />
            <Text style={styles.bookAnotherButtonText}>Book another</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleNavigateHome()}
            style={styles.goToHomeButton}
          >
            <HomeIcon color={WHITE} size={deviceWidth / 15} />
            <Text style={styles.goToHomeButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SuccessfullyCheckedOutFeedback
        isOpened={isFeedbackModalOpen}
        setFeedbackSent={(val) => setFeedbackSent(val)}
        setOpened={(val) => setFeedbackModalOpen(val)}
      />
    </SafeAreaView>
  );
};

const pickerStyle: PickerStyle = {
  inputAndroid: {
    height: 50,
    width: deviceWidth / 1.05,
    backgroundColor: WHITE,
    alignSelf: 'center',
  },
  inputIOS: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    width: deviceWidth / 1.05,
    backgroundColor: WHITE,
    alignSelf: 'center',
  },
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
    flex: 1,
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  itemContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    color: GRAY,
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  ratingContainer: {
    width: deviceWidth / 1.05,
    height: 70,
    backgroundColor: WHITE,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footer: {
    borderTopColor: INPUT_GRAY_COLOR,
    borerTopWidth: 1,
    height: 80,
    backgroundColor: WHITE,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  bookAnotherButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
    width: deviceWidth / 2.1,
    height: 50,
  },
  bookAnotherButtonText: {
    marginLeft: 10,
    color: FPT_ORANGE_COLOR,
    fontSize: deviceWidth / 19,
    fontWeight: '600',
  },
  goToHomeButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
    width: deviceWidth / 2.3,
    height: 50,
  },
  goToHomeButtonText: {
    color: WHITE,
    fontSize: deviceWidth / 19,
    fontWeight: '600',
    margin: 10,
  },
  submitFeedbackButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: FPT_ORANGE_COLOR,
    width: deviceWidth / 1.25,
    height: 50,
  },
  submitFeedbackButtonText: {
    color: WHITE,
    fontSize: deviceWidth / 19,
    fontWeight: '600',
  },
  submitFeedbackContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: GRAY,
    width: deviceWidth / 1.25,
    height: 50,
  },
  description: {
    width: deviceWidth / 1.05,
    height: 100,
    backgroundColor: WHITE,
    alignSelf: 'center',
    borderRadius: 8,
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    paddingHorizontal: 10,
  },
});

export default CheckoutSuccessfully;
