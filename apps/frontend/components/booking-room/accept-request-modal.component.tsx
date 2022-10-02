import React from 'react';
import { createStyles, Modal, Text } from '@mantine/core';
import { BookingRequestParams } from '../../models/pagination-params/booking-room-params.model';
import AcceptRequestComponent from './accept-request.component';

interface AcceptRequestModalProps {
  isShown: boolean;
  toggleShown(): void;
  toggleInfoModalShown(): void;
  setCount(val): void;
  pagination: BookingRequestParams;
}
const AcceptRequestModal: React.FC<AcceptRequestModalProps> = (props) => {
  const { classes } = useStyles();

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalTitle}>Are you sure?</Text>;
  };

  return (
    <Modal
      centered
      zIndex={200}
      title={<ModalHeaderTitle />}
      opened={props.isShown}
      onClose={() => props.toggleShown()}
      size={'auto'}
    >
      <AcceptRequestComponent
        isShown={props.isShown}
        toggleShown={props.toggleShown}
        toggleInforModalShown={props.toggleInfoModalShown}
        setCount={props.setCount}
        pagination={props.pagination}
      />
    </Modal>
  );
};

const useStyles = createStyles({
  modalTitle: {
    fontWeight: 600,
    fontSize: 22,
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 10,
  },
  modalBody: {
    margin: 10,
    width: 355,
  },
  modalFooter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: 355,
  },
});

export default AcceptRequestModal;
