import React, { useEffect, useMemo, useState } from 'react';
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
import { useAppDispatch } from '../../redux/hooks';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { showNotification } from '@mantine/notifications';
import { fetchFeedbacks } from '../../redux/features/feedback/thunk/fetch-feedback';
import { FeedbackPaginationParams } from '../../models/pagination-params/feedback-paging-params.model';
import { io } from 'socket.io-client';
import { sendFeedback } from '../../redux/features/feedback/thunk/send-feedback.thunk';
import { fetchCountRequestFeedbacks } from '../../redux/features/feedback/thunk/fetch-count-feedbacks';

interface AddFeedbackModalProps {
  isShown: boolean;
  toggleShown(): void;
  pagination: FeedbackPaginationParams;
  feedbackTypes: any[];
  setCount(val): void;
}

const AddFeedbackValidation = Yup.object().shape({
  feedback: Yup.string()
    .trim()
    .min(2, 'Feedback message must have at least 2 character.')
    .max(500, 'Feedback message can only have at most 500 characters.')
    .required('Feedback message is required!'),
});

const AddFeedbackModal: React.FC<AddFeedbackModalProps> = (props) => {
  const { classes } = useStyles();
  const [isAddDisabled, setAddDisabled] = useState<boolean>(false);
  const [feedbackType, setFeedbackType] = useState<string>('');
  const socket = useMemo(() => {
    return io('ws://localhost:5000/feedback');
  }, []);

  const dispatch = useAppDispatch();
  const dimension = useWindowDimensions();

  const handleAddSubmit = async (values) => {
    dispatch(
      sendFeedback({
        ...values,
        type: feedbackType,
      })
    )
      .unwrap()
      .then((response) => {
        socket.emit('sendFeedback', response.createdBy);
        showNotification({
          id: 'load-data',
          color: 'teal',
          title: 'Feedback was sent',
          message: 'Feedback successfully added to the system',
          icon: <Check />,
          autoClose: 3000,
        })
      }
      )
      .then(() => {
        props.toggleShown();
        dispatch(fetchFeedbacks(props.pagination))
        dispatch(fetchCountRequestFeedbacks()).unwrap().then(val => props.setCount(val)).finally(() =>
          formik.resetForm()
        );
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
      type: null,
    },
    onSubmit: (values) => handleAddSubmit(values),
    validationSchema: AddFeedbackValidation,
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
              <InputWrapper
                label="Feedback"
                description="(Optional) Maximum length is 500 characters."
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

export default AddFeedbackModal;
