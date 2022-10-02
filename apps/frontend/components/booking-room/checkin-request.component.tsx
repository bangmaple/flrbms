import React from 'react';
import { Button, createStyles, Modal, Text } from '@mantine/core';
import { Check, CircleCheck, X } from 'tabler-icons-react';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { BookingRequestParams } from '../../models/pagination-params/booking-room-params.model';
import { fetchRoomBookings } from '../../redux/features/room-booking/thunk/fetch-room-booking-list';
import { showNotification } from '@mantine/notifications';
import { acceptCheckinRequest } from '../../redux/features/room-booking/thunk/accept-checkin-request';
import { fetchCountRequestBooking } from '../../redux/features/room-booking/thunk/fetch-count-request-booking';

interface CheckinRequestModalProps {
  isShown: boolean;

  toggleShown(): void;

  toggleInforModalShown(): void;
  setCount(val): void;
  pagination: BookingRequestParams;
}

const CheckinRequestModal: React.FC<CheckinRequestModalProps> = (props) => {
  const { classes } = useStyles();
  const selectedRequestId = useAppSelector(
    (state) => state.roomBooking.roomBooking.id
  );

  const dispatch = useAppDispatch();

  const handleCheckinSelectedRequest = () => {
    dispatch(acceptCheckinRequest(selectedRequestId))
      .catch((e) =>
        showNotification({
          id: 'checkin-booking-room',
          color: 'red',
          title: 'Error while checking in  booking room',
          message: e.message ?? 'Failed to checkin booking room',
          icon: <X />,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'checkin-booking-room',
          color: 'teal',
          title: 'This booking room was checked-in',
          message: 'This booking room was successfully checked-in',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then(() => {
        props.toggleShown();
        props.toggleInforModalShown();
        dispatch(fetchRoomBookings(props.pagination));
        dispatch(fetchCountRequestBooking()).unwrap().then(val => props.setCount(val));
      });
  };

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalTitle}>Check in request</Text>;
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
      <Text className={classes.modalBody}>
        Are you sure accept user to Check-in
      </Text>
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
          onClick={() => handleCheckinSelectedRequest()}
          variant="outline"
          color={'green'}
          leftIcon={<CircleCheck />}
        >
          Check in
        </Button>
      </div>
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

export default CheckinRequestModal;
