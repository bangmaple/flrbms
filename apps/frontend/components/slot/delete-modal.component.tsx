import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  Modal,
  Table,
  Text,
} from '@mantine/core';
import { Check, ScanEye, Trash, X } from 'tabler-icons-react';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { PaginationParams } from '../../models/pagination-params.model';
import Th from '../../components/table/th.table.component';
import { showNotification } from '@mantine/notifications';
import { fetchAllSlots } from '../../redux/features/slot/thunk/fetch-slots.thunk';
import { fetchDeletedSlots } from '../../redux/features/slot/thunk/fetch-deleted-device-types';
import dayjs from 'dayjs';
import { fetchRequestsBySlot } from '../../redux/features/room-booking/thunk/fetch-request-by-slot';
import { deleteSlotById } from '../../redux/features/slot/thunk/delete-slot-by-id.thunk';

interface DeleteModalProps {
  isShown: boolean;
  toggleShown(): void;
  keySlot: string
}

const DeleteModal: React.FC<DeleteModalProps> = (props) => {
  const { classes } = useStyles();

  const dispatch = useAppDispatch();

  const handleDeleteSlot = () => {
    dispatch(deleteSlotById(props.keySlot))
      .unwrap()
      .then(() =>
        showNotification({
          id: 'delete-data',
          color: 'teal',
          title: 'Slot was deleted',
          message: 'Slot was successfully deleted',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then(() => {
        props.toggleShown();
        dispatch(fetchAllSlots());
      })
      .catch((e) =>
        showNotification({
          id: 'delete-data',
          color: 'red',
          title: 'Error while deleting slot',
          message: e.message ?? 'Failed to delete slot',
          icon: <X />,
          autoClose: 3000,
        })
      );
  };





  // useEffect(() => {
  //   if (!isShownListRequest) {
  //     setRoomType('');
  //   }
  // }, [isShownListRoom]);

  // const handleUpdateType = (room, roomTypeId: string) => {
  //   dispatch(
  //     updateRoomById({
  //       id: room.id,
  //       payload: {
  //         ...room,
  //         type: roomTypeId,
  //       },
  //     })
  //   )
  //     .unwrap()
  //     .catch((e) =>
  //       showNotification({
  //         id: 'load-data',
  //         color: 'red',
  //         title: 'Error while updating library room',
  //         message: e.message ?? 'Failed to update library room',
  //         icon: <X />,
  //         autoClose: 3000,
  //       })
  //     )
  //     .then(() =>
  //       showNotification({
  //         id: 'load-data',
  //         color: 'teal',
  //         title: 'Library room was updated',
  //         message: 'Library room was successfully updated',
  //         icon: <Check />,
  //         autoClose: 3000,
  //       })
  //     )
  //     // .then(() => props.toggleShown())
  //     .then(() =>
  //       dispatch(fetchRoomsByRoomType(selectedRoomTypeId))
  //         .unwrap()
  //         .then((response) => setListRoom(response))
  //     );
  // };



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
         Are you sure to
          <b> delete this slot? </b> This action cannot be redo
        </Text>
        <div className={classes.modalFooter}>
          <Button
            color="red"
            leftIcon={<Trash />}
            onClick={() => handleDeleteSlot()}
            style={{
              width: '60%',
              margin: 10,
            }}
          >
            Delete this slot
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
