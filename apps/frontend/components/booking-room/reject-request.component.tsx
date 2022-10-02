import React, { useMemo } from 'react';
import { Button, createStyles, Modal, Text, Textarea } from '@mantine/core';
import { Archive, Check, X } from 'tabler-icons-react';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { BookingRequestParams } from '../../models/pagination-params/booking-room-params.model';
import { fetchRoomBookings } from '../../redux/features/room-booking/thunk/fetch-room-booking-list';
import { showNotification } from '@mantine/notifications';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { rejectBooking } from '../../redux/features/room-booking/thunk/reject-booking';
import { fetchCountRequestBooking } from 'apps/frontend/redux/features/room-booking/thunk/fetch-count-request-booking';
import { io } from 'socket.io-client';

interface RejectRequestModalProps {
  isShown: boolean;
  toggleShown(): void;
  toggleInforModalShown(): void;
  setCount(val): void;
  pagination: BookingRequestParams;
}

const validation = Yup.object().shape({
  reason: Yup.string()
    .trim()
    .min(2, 'Reason must be at least 2 characters')
    .max(100, 'Reason can only maximum at 100 characters')
    .required('Reason is required'),
});

const RejectRequestModal: React.FC<RejectRequestModalProps> = (props) => {
  const { classes } = useStyles();
  const selectedRequestId = useAppSelector(
    (state) => state.roomBooking.roomBooking.id
  );
  const socket = useMemo(() => {
    return io('ws://localhost:5000/booking');
  }, []);

  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      id: selectedRequestId,
      reason: '',
    },
    enableReinitialize: true,
    onSubmit: (values) => handleRejectSelectedRequest(values),
    validationSchema: validation,
  });

  const handleRejectSelectedRequest = (values) => {
    dispatch(rejectBooking(values))
      .unwrap()
      .then((response) => {
        socket.emit('rejectRequest', response.bookedFor);
        showNotification({
          id: 'reject-booking-room',
          color: 'teal',
          title: 'This booking room was rejectled',
          message: 'This booking room was successfully rejectled',
          icon: <Check />,
          autoClose: 3000,
        });
      })
      .then(() => {
        props.toggleShown();
        props.toggleInforModalShown();
        dispatch(fetchRoomBookings(props.pagination));
        dispatch(fetchCountRequestBooking())
          .unwrap()
          .then((val) => props.setCount(val));
      })
      .catch((e) =>
        showNotification({
          id: 'reject-booking-room',
          color: 'red',
          title: 'Error while reject booking room',
          message: e.message ?? 'Failed to reject booking room',
          icon: <X />,
          autoClose: 3000,
        })
      );
  };

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalTitle}>Are you sure?</Text>;
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
            <Text className={classes.modalBody}>
              After rejecting this request, system will send a notification to
              the person who booked this room.
            </Text>
            <div>
              <Textarea
                minRows={4}
                placeholder="Reason"
                label="Reason"
                required
                id="reason"
                name="reason"
                error={formik.errors.reason}
                onChange={formik.handleChange}
                radius="md"
                value={formik.values.reason}
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
                color="red"
                leftIcon={<Archive />}
                onClick={() => formik.handleSubmit()}
              >
                Reject this request
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

export default RejectRequestModal;
