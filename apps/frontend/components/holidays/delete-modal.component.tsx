import React from 'react';
import {
  Button,
  createStyles,
  Modal,
  Text,
} from '@mantine/core';
import {
  Check,
  Trash,
  X,
} from 'tabler-icons-react';
import {FPT_ORANGE_COLOR} from '@app/constants';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {PaginationParams} from '../../models/pagination-params.model';
import {showNotification} from '@mantine/notifications';
import {deleteHolidayById} from "../../redux/features/holidays/thunk/delete-holiday-by-id.thunk";
import {fetchHolidays} from "../../redux/features/holidays/thunk/fetch-holidays.thunk";
import {fetchDeletedHolidays} from "../../redux/features/holidays/thunk/fetch-deleted-holidays.thunk";


interface DeleteModalProps {
  isShown: boolean;
  toggleShown(): void;
  pagination: PaginationParams;

}

const DeleteModal: React.FC<DeleteModalProps> = (props) => {
  const {classes} = useStyles();

  const selectedHolidayId = useAppSelector((state) => state.holiday.holiday.id);
  const dispatch = useAppDispatch();

  const handleDeleteHoliday = () => {
    dispatch(deleteHolidayById(selectedHolidayId))
      .unwrap()
      .then(() =>
        showNotification({
          id: 'disable-data',
          color: 'teal',
          title: 'This holiday was deleted',
          message: 'This holiday was successfully deleted',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then(() => {
        props.toggleShown();
        dispatch(fetchHolidays(props.pagination));
        dispatch(fetchDeletedHolidays(''));
      })
      .catch((e) =>
        showNotification({
          id: 'delete-data',
          color: 'red',
          title: 'Error while deleting holiday',
          message: e.message ?? 'Failed to delete holiday',
          icon: <X/>,
          autoClose: 3000,
        })
      );
  }
  return (
    <Modal
      closeOnClickOutside={true}
      centered
      zIndex={100}
      title={<ModalHeaderTitle/>}
      opened={props.isShown}
      onClose={() => props.toggleShown()}
    >
      <div className={classes.modalContainer}>
        <Text className={classes.modalBody} style={{textAlign: "left"}}>
          Are you sure to delete this holiday?
        </Text>
        <div className={classes.modalFooter}>

          <Button
            color="red"
            leftIcon={<Trash/>}
            onClick={() => handleDeleteHoliday()}
            style={{
              width: '60%',
              margin: 10,

            }}
          >
            Delete this holiday
          </Button>
          <Button
            onClick={() => props.toggleShown()}
            leftIcon={<X/>}
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

const ModalHeaderTitle: React.FC = () => {
  const {classes} = useStyles();
  return <Text className={classes.modalTitle}>Are you sure?</Text>;
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
