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
import {disableFeedbackTypeById} from "../../redux/features/feedback-type/thunk/disable-feedback-type-by-id.thunk";
import {fetchFeedbackTypes} from "../../redux/features/feedback-type/thunk/fetch-feedback-types.thunk";
import {fetchDisabledFeedbackTypes} from "../../redux/features/feedback-type/thunk/fetch-disabled-feedback-types";


interface DisableModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PaginationParams;
  feedbackTypes: any[];
}

const DisableModal: React.FC<DisableModalProps> = (props) => {
  const {classes} = useStyles();
  const selectedFeedbackTypeId = useAppSelector(
    (state) => state.feedbackType.feedbackType.id
  );


  const dispatch = useAppDispatch();

  const handleDisableFeedbackType = () => {
    dispatch(disableFeedbackTypeById(selectedFeedbackTypeId))
      .unwrap()
      .then(() =>
        showNotification({
          id: 'disable-data',
          color: 'teal',
          title: 'Feedback type was disabled',
          message: 'Feedback type was successfully disabled',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then(() => {
        props.toggleShown();
        dispatch(fetchFeedbackTypes(props.pagination));
        dispatch(fetchDisabledFeedbackTypes(''));
      })
      .catch((e) =>
        showNotification({
          id: 'disable-data',
          color: 'red',
          title: 'Error while disabling feedback type',
          message: e.message ?? 'Failed to disable feedback type',
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
        <Text className={classes.modalBody}>
          Are you sure to disable this feedback type? Disabling this reason does not affect to feedbacks from staffs.
        </Text>
        <div className={classes.modalFooter}>

          <Button
            color="red"
            leftIcon={<Trash/>}
            onClick={() => handleDisableFeedbackType()}
            style={{
              width: '60%',
              margin: 10,
            }}
          >
            Disable this type
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

export default DisableModal;
