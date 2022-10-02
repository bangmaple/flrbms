import React, { useMemo } from 'react';
import { Button, createStyles, Modal, Text, Textarea } from '@mantine/core';
import { Archive, Check, X } from 'tabler-icons-react';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { showNotification } from '@mantine/notifications';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchFeedbacks } from '../../redux/features/feedback/thunk/fetch-feedback';
import { resolveFeedback } from '../../redux/features/feedback/thunk/resolve-feedback';
import { FeedbackPaginationParams } from '../../models/pagination-params/feedback-paging-params.model';
import { fetchCountRequestFeedbacks } from '../../redux/features/feedback/thunk/fetch-count-feedbacks';
import { io } from 'socket.io-client';

interface ResolveFeedbackModalProps {
  isShown: boolean;
  toggleShown(): void;
  toggleInforModalShown(): void;
  setCount(val): void;
  pagination: FeedbackPaginationParams;
}

const validation = Yup.object().shape({
  replyMessage: Yup.string()
    .trim()
    .min(2, 'Solution must be at least 2 characters')
    .max(100, 'Solution can only maximum at 100 characters')
    .required('Solution is required'),
});

const ResolveFeedbackModal: React.FC<ResolveFeedbackModalProps> = (props) => {
  const { classes } = useStyles();
  const selectedFeedbackId = useAppSelector(
    (state) => state.feedback.feedback.id
  );
  const socket = useMemo(() => {
    return io('ws://localhost:5000/feedback');
  }, []);

  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      id: selectedFeedbackId,
      replyMessage: '',
    },
    enableReinitialize: true,
    onSubmit: (values) => handleResolveSelectedFeedback(values),
    validationSchema: validation,
  });

  const handleResolveSelectedFeedback = (values) => {
    dispatch(resolveFeedback(values))
      .unwrap()
      .then((response) => {
        socket.emit('resolveFeedback', response.createdBy);
        showNotification({
          id: 'resolve-feedback',
          color: 'teal',
          title: 'This feedback was resolveled',
          message: 'This feedback was successfully resolveled',
          icon: <Check />,
          autoClose: 3000,
        });
      })
      .then(() => {
        props.toggleShown();
        props.toggleInforModalShown();
        dispatch(fetchFeedbacks(props.pagination));
        dispatch(fetchCountRequestFeedbacks())
          .unwrap()
          .then((val) => props.setCount(val));
      })
      .catch((e) =>
        showNotification({
          id: 'resolve-feedback',
          color: 'red',
          title: 'Error while resolve feedback',
          message: e.message ?? 'Failed to resolve feedback',
          icon: <X />,
          autoClose: 3000,
        })
      );
  };

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalTitle}>Resolve feedback</Text>;
  };

  return (
    <Modal
      closeOnClickOutside={false}
      centered
      zIndex={200}
      title={<ModalHeaderTitle />}
      opened={props.isShown}
      onClose={() => props.toggleShown()}
    >
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit}>
          <div className={classes.modalContainer}>
            <div>
              <Textarea
                minRows={4}
                placeholder="Solution"
                label="Solution"
                required
                id="replyMessage"
                name="replyMessage"
                error={formik.errors.replyMessage}
                onChange={formik.handleChange}
                radius="md"
                value={formik.values.replyMessage}
              />
            </div>
            <div className={classes.modalFooter}>
              <Button
                onClick={() => props.toggleShown()}
                leftIcon={<X />}
                style={{
                  backgroundColor: FPT_ORANGE_COLOR,
                }}
              >
                Cancel
              </Button>
              <Button
                color="green"
                leftIcon={<Archive />}
                onClick={() => formik.handleSubmit()}
              >
                Resolve this feedback
              </Button>
            </div>
          </div>
        </Form>
      </FormikProvider>
    </Modal>
  );
};

const useStyles = createStyles({
  modalTitle: {
    fontWeight: 600,
    fontSize: 22,
  },
  modalContainer: {
    margin: 10,
  },
  modalBody: {
    margin: 10,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default ResolveFeedbackModal;
