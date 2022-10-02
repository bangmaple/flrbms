import React from 'react';
import { Button, createStyles, Modal, Text } from '@mantine/core';
import { Check, Trash, X } from 'tabler-icons-react';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchDeletedBookingReasons,
  fetchBookingReasons,
  deleteBookingReasonById,
} from '../../redux/features/booking-reason';
import { PaginationParams } from '../../models/pagination-params.model';
import { showNotification } from '@mantine/notifications';

interface DeleteModalProps {
  isShown: boolean;
  toggleShown(): void;
  pagination: PaginationParams;
}

const DeleteModal: React.FC<DeleteModalProps> = (props) => {
  const { classes } = useStyles();
  const selectedBookingReasonId = useAppSelector(
    (state) => state.bookingReason.bookingReason.id
  );

  const dispatch = useAppDispatch();

  const handleDeleteBookingReason = () => {
    dispatch(deleteBookingReasonById(selectedBookingReasonId))
      .catch((e) =>
        showNotification({
          id: 'delete-data',
          color: 'red',
          title: 'Error while delete booking reason',
          message: e.message ?? 'Failed to delete booking reason',
          icon: <X />,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'delete-data',
          color: 'teal',
          title: 'This booking room reason was deleted',
          message: 'This booking room reason was successfully deleted',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then(() => {
        props.toggleShown();
        dispatch(fetchBookingReasons(props.pagination));
        dispatch(fetchDeletedBookingReasons());
      });
  };

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalTitle}>Are you sure?</Text>;
  };

  return (
    <Modal
      closeOnClickOutside={true}
      centered
      zIndex={100}
      title={<ModalHeaderTitle />}
      opened={props.isShown}
      onClose={() => props.toggleShown()}
    >
      <div className={classes.modalContainer}>
        <Text className={classes.modalBody}>
          Are you sure to delete this booking reason? Deleting this reason does
          not affect to booking room process.
        </Text>
        <div className={classes.modalFooter}>
          <Button
            color="red"
            leftIcon={<Trash />}
            onClick={() => handleDeleteBookingReason()}
            style={{
              width: '60%',
              margin: 10,
            }}
          >
            Delete this reason
          </Button>
          <Button
            onClick={() => props.toggleShown()}
            leftIcon={<X />}
            style={{
              backgroundColor: FPT_ORANGE_COLOR,
              width: '60%',
              margin: 10,
            }}
          >
            Cancel
          </Button>
        </div>
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
    textAlign: 'justify',
  },
  modalFooter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  actionButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default DeleteModal;
