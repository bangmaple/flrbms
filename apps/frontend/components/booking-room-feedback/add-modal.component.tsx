import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  InputWrapper,
  Modal,
  Select,
  Text,
  Textarea,
} from '@mantine/core';
import { useWindowDimensions } from '../../hooks/use-window-dimensions';
import { Check, FileDescription, Plus, X } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { showNotification } from '@mantine/notifications';
import ReactStars from 'react-stars';
import { addBookingRoomFeedback } from '../../redux/features/booking-room-feedback/thunk/add-booking-room-feedback.thunk';
import { fetchRoomBookingById } from '../../redux/features/room-booking/thunk/fetch-room-booking-by-id';

interface AddBookingFeedbackModalProps {
  isShown: boolean;
  toggleShown(): void;
  feedbackTypes: any[];
}

const AddBookingFeedbackValidation = Yup.object().shape({
  feedback: Yup.string()
    .trim()
    .min(2, 'Feedback message must have at least 2 character.')
    .max(100, 'Feedback message can only have at most 100 characters.')
    .required('Feedback message is required!'),
});

const AddBookingFeedbackModal: React.FC<AddBookingFeedbackModalProps> = (
  props
) => {
  const { classes } = useStyles();
  const [isAddDisabled, setAddDisabled] = useState<boolean>(false);
  const [feedbackType, setFeedbackType] = useState<string>(null);
  const requestBooking = useAppSelector(
    (state) => state.roomBooking.roomBooking
  );

  const dispatch = useAppDispatch();
  const dimension = useWindowDimensions();

  const handleAddSubmit = async (values) => {
    dispatch(
      addBookingRoomFeedback({
        ...values,
        type: feedbackType,
      })
    )
      .unwrap()
      .then(() =>
        showNotification({
          id: 'load-data',
          color: 'teal',
          title: 'Feedback was sent',
          message: 'Feedback successfully added to the system',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then(() => {
        props.toggleShown();
        formik.resetForm();
        setFeedbackType(null);
        dispatch(fetchRoomBookingById(requestBooking.id))
      })
      .catch((e) =>
        showNotification({
          id: 'load-data',
          color: 'red',
          title: 'Error while send feedback',
          message: e.message ?? 'Failed to send feedback',
          icon: <X />,
          autoClose: 3000,
        })
      );
  };

  const formik = useFormik({
    initialValues: {
      feedback: '',
      rateNum: 1,
      bookingRoomId: requestBooking?.id,
      type: null,
    },
    enableReinitialize: true,
    onSubmit: (values) => handleAddSubmit(values),
    validationSchema: AddBookingFeedbackValidation,
  });

  useEffect(() => {
    if (
      formik.initialValues.feedback === formik.values.feedback &&
      formik.initialValues.type === formik.values.type
    ) {
      setAddDisabled(true);
    } else {
      setAddDisabled(false);
    }
  }, [formik.values.feedback, formik.values.type]);

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalHeaderTitle}>Send new feedback</Text>;
  };

  const handleCancelAddModal = () => {
    props.toggleShown();
    formik.resetForm();
  };

  const handleAddAction = () => {
    if (!feedbackType) {
      showNotification({
        id: 'load-data',
        color: 'red',
        title: 'Error while send feedback',
        message: 'Please select the type that exists',
        icon: <X />,
        autoClose: 3000,
      });
    } else {
      formik.submitForm();
    }
  };

  return (
    <>
      <Modal
        title={<ModalHeaderTitle />}
        size={dimension.width / 2}
        centered
        opened={props.isShown}
        onClose={() => props.toggleShown()}
      >
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <div className={classes.modalBody}>
              <InputWrapper required label="Feedback type">
                <Select
                  name="type"
                  id="feedback-type"
                  onChange={(e) => setFeedbackType(e)}
                  searchable
                  value={feedbackType}
                  data={props.feedbackTypes}
                />
              </InputWrapper>
              <InputWrapper
                label="Feedback"
                description="(Optional) Maximum length is 100 characters."
              >
                <Textarea
                  icon={<FileDescription />}
                  className={classes.textInput}
                  id="feedback"
                  name="feedback"
                  error={formik.errors.feedback}
                  onChange={formik.handleChange}
                  radius="md"
                  value={formik.values.feedback}
                />
              </InputWrapper>

              <ReactStars
                count={5}
                onChange={(value) => formik.setFieldValue('rateNum', value)}
                value={formik.values.rateNum}
                size={40}
                color2={'#ffd700'}
                half={false}
              />
            </div>

            <div className={classes.modalFooter}>
              <Button
                onClick={() => handleCancelAddModal()}
                variant="outline"
                color={'red'}
                leftIcon={<X />}
              >
                Cancel
              </Button>

              <Button
                color="green"
                disabled={isAddDisabled}
                onClick={() => handleAddAction()}
                leftIcon={<Plus />}
              >
                Add
              </Button>
            </div>
          </Form>
        </FormikProvider>
      </Modal>
    </>
  );
};

const useStyles = createStyles({
  modalHeaderTitle: {
    fontWeight: 600,
    fontSize: 22,
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    margin: 20,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 10,
  },
  modalInputDate: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    marginTop: 10,
  },
});

export default AddBookingFeedbackModal;
